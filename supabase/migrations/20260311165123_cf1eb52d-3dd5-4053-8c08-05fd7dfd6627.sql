
-- Validation trigger for chat_messages length
CREATE OR REPLACE FUNCTION public.validate_chat_message_length()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  IF char_length(NEW.message) > 1000 THEN
    RAISE EXCEPTION 'Message exceeds maximum length of 1000 characters';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_chat_message_length
  BEFORE INSERT OR UPDATE ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_chat_message_length();

-- Validation trigger for private_messages length
CREATE OR REPLACE FUNCTION public.validate_private_message_length()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  IF char_length(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Message exceeds maximum length of 2000 characters';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_private_message_length
  BEFORE INSERT OR UPDATE ON public.private_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_private_message_length();
