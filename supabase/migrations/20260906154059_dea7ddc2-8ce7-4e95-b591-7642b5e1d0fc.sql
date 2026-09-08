insert into public.profiles (id, full_name, email)
select u.id, coalesce(u.raw_user_meta_data->>'full_name',''), u.email
from auth.users u
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
select u.id, 'customer'::public.app_role from auth.users u
on conflict do nothing;