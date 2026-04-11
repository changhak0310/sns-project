export type PostComposerMode = "create" | "edit";

export type PostImageInput = {
  file: File | null;
  previewUrl: string;
  source: "local" | "remote";
};

export type Post = {
  id: number;
  shortcode: string;
  caption: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PostComposerFormProps = {
  mode: PostComposerMode;
  initialPost?: Post | null;
};

export type PostImagePickerProps = {
  images: PostImageInput[];
  maxImages: number;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (images: PostImageInput[]) => void;
};

export type CaptionInputProps = {
  value: string;
  fieldErrorMessage?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export type PostSubmitButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};

export type PostPreviewProps = {
  images: PostImageInput[];
  caption: string;
};

export type PostActionMenuProps = {
  postId: number;
  editHref: string;
  canEdit: boolean;
  canDelete: boolean;
};

export type EditPostLinkButtonProps = {
  href: string;
  disabled?: boolean;
};

export type DeletePostButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
};

export type PostFormErrorMessageProps = {
  message: string;
};

export type PostActionErrorMessageProps = {
  message: string;
};

export type PostCardProps = {
  post: Post;
  editHref: string;
  canEdit: boolean;
  canDelete: boolean;
  className?: string;
};

export type UsePostComposerParams = {
  mode: PostComposerMode;
  initialPost?: Post | null;
};

export type PostComposerState = {
  images: PostImageInput[];
  caption: string;
  imagesError: string;
  captionError: string;
  formError: string;
  isFormValid: boolean;
  isLoading: boolean;
  savedPost: Post | null;
};

export type PostComposerComputed = {
  editingPostId: number | null;
};

export type PostComposerActions = {
  setImages: (images: PostImageInput[]) => void;
  setCaption: (value: string) => void;
  createPost: () => Promise<void>;
  updatePost: () => Promise<void>;
  resetPostComposerState: () => void;
};

export type UsePostComposerReturn = PostComposerState &
  PostComposerComputed &
  PostComposerActions;

export type UsePostActionMenuParams = {
  postId: number;
};

export type PostActionMenuState = {
  isActionMenuOpen: boolean;
  actionMenuError: string;
  isDeleting: boolean;
};

export type PostActionMenuActions = {
  openActionMenu: () => void;
  closeActionMenu: () => void;
  deletePost: () => Promise<void>;
};

export type UsePostActionMenuReturn = PostActionMenuState & PostActionMenuActions;

export type PostMutationResult =
  | {
      success: true;
      data: Post;
    }
  | {
      success: false;
      message: string;
    };

export type DeletePostResult =
  | {
      success: true;
      deletedPostId: number;
    }
  | {
      success: false;
      message: string;
    };
