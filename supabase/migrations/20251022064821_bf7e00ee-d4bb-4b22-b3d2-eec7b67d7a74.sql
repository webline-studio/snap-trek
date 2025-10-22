-- Drop existing foreign keys that reference auth.users
ALTER TABLE public.stories DROP CONSTRAINT IF EXISTS stories_user_id_fkey;
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;

-- Add new foreign keys that reference profiles instead
ALTER TABLE public.stories
ADD CONSTRAINT stories_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.posts
ADD CONSTRAINT posts_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

ALTER TABLE public.comments
ADD CONSTRAINT comments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;