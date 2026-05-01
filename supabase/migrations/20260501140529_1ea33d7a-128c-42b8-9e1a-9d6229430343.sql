UPDATE public.faqs SET 
  question = regexp_replace(question, '\m(Adrian|Sophia)\M', '{firstName}', 'gi'),
  answer = regexp_replace(answer, '\m(Adrian|Sophia)\M', '{firstName}', 'gi')
WHERE scope = 'member';