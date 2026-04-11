param(
  [string]$RepoPath = (Get-Location).Path,
  [int]$IdleSeconds = 15,
  [int]$PollSeconds = 2,
  [string]$BaseBranch,
  [string]$BranchName,
  [string]$TokenEnvVar = "GITHUB_TOKEN",
  [string]$CommitPrefix = "codex",
  [switch]$CreateBranchIfNeeded,
  [switch]$DryRun,
  [switch]$RunOnce
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Log {
  param([string]$Message)

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Write-Host "[$timestamp] $Message"
}

function Invoke-Git {
  param(
    [Parameter(Mandatory)]
    [string[]]$Args,
    [switch]$AllowFailure
  )

  $output = & git -C $RepoPath @Args 2>&1
  $exitCode = $LASTEXITCODE
  $text = if ($output -is [System.Array]) {
    ($output | ForEach-Object { "$_" }) -join [Environment]::NewLine
  } else {
    "$output"
  }

  if (-not $AllowFailure -and $exitCode -ne 0) {
    throw "git $($Args -join ' ') failed with exit code $exitCode.`n$text"
  }

  return @{
    ExitCode = $exitCode
    Text = $text.Trim()
  }
}

function Invoke-GitText {
  param(
    [Parameter(Mandatory)]
    [string[]]$Args,
    [switch]$AllowFailure
  )

  return (Invoke-Git -Args $Args -AllowFailure:$AllowFailure).Text
}

function Test-GitSuccess {
  param(
    [Parameter(Mandatory)]
    [string[]]$Args
  )

  return (Invoke-Git -Args $Args -AllowFailure).ExitCode -eq 0
}

function Test-InsideGitWorkTree {
  $result = Invoke-GitText -Args @("rev-parse", "--is-inside-work-tree") -AllowFailure
  return $result -eq "true"
}

function Get-CurrentBranch {
  $branch = Invoke-GitText -Args @("rev-parse", "--abbrev-ref", "HEAD")
  if ($branch -eq "HEAD") {
    return $null
  }

  return $branch
}

function Get-DefaultBaseBranch {
  if ($BaseBranch) {
    return $BaseBranch
  }

  $symbolicRef = Invoke-GitText -Args @("symbolic-ref", "refs/remotes/origin/HEAD") -AllowFailure
  if ($symbolicRef) {
    return ($symbolicRef -split "/")[-1]
  }

  foreach ($candidate in @("master", "main")) {
    if (Test-GitSuccess -Args @("show-ref", "--verify", "--quiet", "refs/remotes/origin/$candidate")) {
      return $candidate
    }
  }

  return "master"
}

function Ensure-Branch {
  param(
    [Parameter(Mandatory)]
    [string]$ResolvedBaseBranch
  )

  $currentBranch = Get-CurrentBranch

  if ($BranchName) {
    if ($currentBranch -eq $BranchName) {
      return $BranchName
    }

    if ($DryRun) {
      Write-Log "Would switch to branch '$BranchName'."
      return $BranchName
    }

    if (Test-GitSuccess -Args @("show-ref", "--verify", "--quiet", "refs/heads/$BranchName")) {
      Invoke-Git -Args @("checkout", $BranchName) | Out-Null
      return $BranchName
    }

    if (Test-GitSuccess -Args @("show-ref", "--verify", "--quiet", "refs/remotes/origin/$BranchName")) {
      Invoke-Git -Args @("checkout", "-b", $BranchName, "--track", "origin/$BranchName") | Out-Null
      return $BranchName
    }

    Invoke-Git -Args @("checkout", "-b", $BranchName) | Out-Null
    return $BranchName
  }

  if ($currentBranch -and $currentBranch -ne $ResolvedBaseBranch) {
    return $currentBranch
  }

  if (-not $CreateBranchIfNeeded) {
    throw "Current branch matches base branch '$ResolvedBaseBranch'. Checkout a feature branch or rerun with -CreateBranchIfNeeded."
  }

  $generatedBranch = "codex-auto/{0}" -f (Get-Date -Format "yyyyMMdd-HHmmss")

  if ($DryRun) {
    Write-Log "Would create and switch to branch '$generatedBranch'."
    return $generatedBranch
  }

  Invoke-Git -Args @("checkout", "-b", $generatedBranch) | Out-Null
  return $generatedBranch
}

function Get-OriginRepository {
  $originUrl = Invoke-GitText -Args @("remote", "get-url", "origin")

  if ($originUrl -match "^https://github\.com/(?<owner>[^/]+)/(?<repo>[^/.]+?)(?:\.git)?$") {
    return @{
      Owner = $matches.owner
      Name = $matches.repo
      FullName = "$($matches.owner)/$($matches.repo)"
    }
  }

  if ($originUrl -match "^git@github\.com:(?<owner>[^/]+)/(?<repo>[^/.]+?)(?:\.git)?$") {
    return @{
      Owner = $matches.owner
      Name = $matches.repo
      FullName = "$($matches.owner)/$($matches.repo)"
    }
  }

  throw "Unsupported origin URL: $originUrl"
}

function Get-GitHubToken {
  $token = [Environment]::GetEnvironmentVariable($TokenEnvVar, "Process")
  if (-not $token) {
    $token = [Environment]::GetEnvironmentVariable($TokenEnvVar, "User")
  }
  if (-not $token) {
    $token = [Environment]::GetEnvironmentVariable($TokenEnvVar, "Machine")
  }

  return $token
}

function Invoke-GitHubApi {
  param(
    [Parameter(Mandatory)]
    [string]$Method,
    [Parameter(Mandatory)]
    [string]$Path,
    [object]$Body
  )

  $token = Get-GitHubToken
  if (-not $token) {
    throw "Missing GitHub token. Set the '$TokenEnvVar' environment variable before running the watcher."
  }

  $headers = @{
    Authorization = "Bearer $token"
    Accept = "application/vnd.github+json"
    "User-Agent" = "codex-auto-pr"
  }
  $uri = "https://api.github.com$Path"

  if ($PSBoundParameters.ContainsKey("Body")) {
    $jsonBody = $Body | ConvertTo-Json -Depth 10
    return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers -Body $jsonBody -ContentType "application/json"
  }

  return Invoke-RestMethod -Method $Method -Uri $uri -Headers $headers
}

function Get-WorktreeFingerprint {
  return Invoke-GitText -Args @("status", "--porcelain")
}

function Get-AheadCount {
  $status = Invoke-GitText -Args @("status", "--porcelain=v2", "--branch")
  if (-not $status) {
    return 0
  }

  foreach ($line in ($status -split "`r?`n")) {
    if ($line -match "^# branch\.ab \+(?<ahead>\d+) -(?<behind>\d+)$") {
      return [int]$matches.ahead
    }
  }

  return 0
}

function Get-BranchDeltaCount {
  param(
    [Parameter(Mandatory)]
    [string]$Branch,
    [Parameter(Mandatory)]
    [string]$ResolvedBaseBranch
  )

  $baseRef = if (Test-GitSuccess -Args @("show-ref", "--verify", "--quiet", "refs/remotes/origin/$ResolvedBaseBranch")) {
    "origin/$ResolvedBaseBranch"
  } else {
    $ResolvedBaseBranch
  }

  $count = Invoke-GitText -Args @("rev-list", "--count", "$baseRef..$Branch") -AllowFailure
  if (-not $count) {
    return 0
  }

  return [int]$count
}

function Get-ChangedFiles {
  $status = Invoke-GitText -Args @("status", "--porcelain")
  if (-not $status) {
    return @()
  }

  return @(
    $status -split "`r?`n" |
      Where-Object { $_ } |
      ForEach-Object {
        if ($_ -match "^[ MARCUD?!]{2}\s+(?<path>.+)$") {
          $matches.path
        }
      } |
      Where-Object { $_ }
  )
}

function New-CommitMessage {
  param(
    [Parameter(Mandatory)]
    [string[]]$Files
  )

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  return "$CommitPrefix: auto update $timestamp ($($Files.Count) files)"
}

function Get-OpenPullRequest {
  param(
    [Parameter(Mandatory)]
    [hashtable]$Repository,
    [Parameter(Mandatory)]
    [string]$Branch,
    [Parameter(Mandatory)]
    [string]$ResolvedBaseBranch
  )

  $headQuery = [Uri]::EscapeDataString("$($Repository.Owner):$Branch")
  $baseQuery = [Uri]::EscapeDataString($ResolvedBaseBranch)
  $prs = Invoke-GitHubApi -Method GET -Path "/repos/$($Repository.FullName)/pulls?state=open&head=$headQuery&base=$baseQuery"

  if ($prs -and $prs.Count -gt 0) {
    return $prs[0]
  }

  return $null
}

function Ensure-PullRequest {
  param(
    [Parameter(Mandatory)]
    [hashtable]$Repository,
    [Parameter(Mandatory)]
    [string]$Branch,
    [Parameter(Mandatory)]
    [string]$ResolvedBaseBranch
  )

  $deltaCount = Get-BranchDeltaCount -Branch $Branch -ResolvedBaseBranch $ResolvedBaseBranch
  if ($deltaCount -le 0) {
    Write-Log "Skipping PR creation because '$Branch' has no commits ahead of '$ResolvedBaseBranch'."
    return
  }

  $existingPr = Get-OpenPullRequest -Repository $Repository -Branch $Branch -ResolvedBaseBranch $ResolvedBaseBranch
  if ($existingPr) {
    Write-Log "Pull request already open: $($existingPr.html_url)"
    return
  }

  if ($DryRun) {
    Write-Log "Would create pull request for '$Branch' -> '$ResolvedBaseBranch'."
    return
  }

  $body = @{
    title = "$CommitPrefix: automated updates for $Branch"
    head = $Branch
    base = $ResolvedBaseBranch
    body = @"
## Automated Change Set
- Created by `scripts/codex-auto-pr.ps1`
- Commits are pushed automatically after the repo is idle for $IdleSeconds second(s)
"@
  }

  $createdPr = Invoke-GitHubApi -Method POST -Path "/repos/$($Repository.FullName)/pulls" -Body $body
  Write-Log "Pull request created: $($createdPr.html_url)"
}

function Test-HasPendingWork {
  param(
    [Parameter(Mandatory)]
    [string]$Branch,
    [Parameter(Mandatory)]
    [string]$ResolvedBaseBranch
  )

  if (Get-WorktreeFingerprint) {
    return $true
  }

  if ((Get-AheadCount) -gt 0) {
    return $true
  }

  return (Get-BranchDeltaCount -Branch $Branch -ResolvedBaseBranch $ResolvedBaseBranch) -gt 0
}

function Process-PendingWork {
  param(
    [Parameter(Mandatory)]
    [hashtable]$Repository,
    [Parameter(Mandatory)]
    [string]$Branch,
    [Parameter(Mandatory)]
    [string]$ResolvedBaseBranch
  )

  try {
    $changedFiles = Get-ChangedFiles

    if ($changedFiles.Count -gt 0) {
      Write-Log "Detected $($changedFiles.Count) change(s)."

      if ($DryRun) {
        Write-Log "Would run: git add -A"
      } else {
        Invoke-Git -Args @("add", "-A") | Out-Null
      }

      $stagedText = Invoke-GitText -Args @("diff", "--cached", "--name-only")
      $stagedFiles = if ($stagedText) {
        @($stagedText -split "`r?`n" | Where-Object { $_ })
      } else {
        @()
      }

      if ($stagedFiles.Count -gt 0) {
        $commitMessage = New-CommitMessage -Files $stagedFiles
        if ($DryRun) {
          Write-Log "Would create commit: $commitMessage"
        } else {
          Invoke-Git -Args @("commit", "-m", $commitMessage) | Out-Null
          Write-Log "Created commit: $commitMessage"
        }
      }
    }

    $aheadCount = Get-AheadCount
    if ($aheadCount -gt 0) {
      if ($DryRun) {
        Write-Log "Would push $aheadCount commit(s) to origin/$Branch."
      } else {
        Invoke-Git -Args @("push", "-u", "origin", $Branch) | Out-Null
        Write-Log "Pushed $aheadCount commit(s) to origin/$Branch."
      }
    }

    Ensure-PullRequest -Repository $Repository -Branch $Branch -ResolvedBaseBranch $ResolvedBaseBranch
    return $true
  } catch {
    Write-Log "Synchronization failed: $($_.Exception.Message)"
    return $false
  }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "git is required but was not found in PATH."
}

if (-not (Test-InsideGitWorkTree)) {
  throw "RepoPath must point to a git working tree: $RepoPath"
}

$resolvedRepoPath = (Resolve-Path $RepoPath).Path
$RepoPath = $resolvedRepoPath
$resolvedBaseBranch = Get-DefaultBaseBranch
$activeBranch = Ensure-Branch -ResolvedBaseBranch $resolvedBaseBranch
$repository = Get-OriginRepository

Write-Log "Watching '$resolvedRepoPath'"
Write-Log "Base branch: '$resolvedBaseBranch'"
Write-Log "Feature branch: '$activeBranch'"
Write-Log "Idle debounce: $IdleSeconds second(s), poll interval: $PollSeconds second(s)"

$lastFingerprint = Get-WorktreeFingerprint
$hasPendingWork = Test-HasPendingWork -Branch $activeBranch -ResolvedBaseBranch $resolvedBaseBranch
$lastActivity = if ($hasPendingWork) {
  (Get-Date).AddSeconds(-($IdleSeconds + 1))
} else {
  Get-Date
}

if ($RunOnce) {
  if ($hasPendingWork) {
    [void](Process-PendingWork -Repository $repository -Branch $activeBranch -ResolvedBaseBranch $resolvedBaseBranch)
  } else {
    Write-Log "No pending changes."
  }

  return
}

while ($true) {
  Start-Sleep -Seconds $PollSeconds

  $currentBranch = Get-CurrentBranch
  if ($currentBranch -and $currentBranch -ne $activeBranch) {
    throw "Branch changed from '$activeBranch' to '$currentBranch'. Stop the watcher and restart it on the target branch."
  }

  $currentFingerprint = Get-WorktreeFingerprint
  if ($currentFingerprint -ne $lastFingerprint) {
    $lastFingerprint = $currentFingerprint
    $lastActivity = Get-Date
    $hasPendingWork = $true
    Write-Log "Detected repository changes. Waiting for idle window."
  } elseif ((Get-AheadCount) -gt 0) {
    $hasPendingWork = $true
  }

  if (-not $hasPendingWork) {
    continue
  }

  $idleFor = (New-TimeSpan -Start $lastActivity -End (Get-Date)).TotalSeconds
  if ($idleFor -lt $IdleSeconds) {
    continue
  }

  $syncSucceeded = Process-PendingWork -Repository $repository -Branch $activeBranch -ResolvedBaseBranch $resolvedBaseBranch
  $lastFingerprint = Get-WorktreeFingerprint
  $hasPendingWork = if ($syncSucceeded) {
    Test-HasPendingWork -Branch $activeBranch -ResolvedBaseBranch $resolvedBaseBranch
  } else {
    $true
  }

  if ($hasPendingWork) {
    $lastActivity = Get-Date
  } else {
    Write-Log "Repository is synchronized. Waiting for the next change."
  }
}
