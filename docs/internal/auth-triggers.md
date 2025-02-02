# Auth Triggers Documentation

## User Profile Creation Trigger

### Overview
Automatically creates a user profile in `user_profiles` when a new user is created in `auth.users`. The trigger ensures that every new user has a corresponding profile with their basic information.

### Implementation

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (
        user_id,
        email,
        first_name,
        last_name
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'first_name')::text, ''),
        COALESCE((NEW.raw_user_meta_data->>'last_name')::text, '')
    );

    RETURN NEW;
EXCEPTION 
    WHEN OTHERS THEN
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Trigger Creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
```

### Key Features
1. **SECURITY DEFINER**: Ensures the function runs with the permissions of its owner
2. **Explicit search_path**: Prevents search_path hijacking
3. **Non-blocking error handling**: Logs errors but allows user creation to proceed
4. **Metadata extraction**: Pulls first_name and last_name from auth.users metadata

### Important Notes
- The trigger runs automatically after user creation
- Uses COALESCE to handle null values in metadata
- Error handling is non-blocking (uses WARNING instead of EXCEPTION)
- Maintains data consistency between auth.users and user_profiles

### Troubleshooting
Common issues and solutions:
1. Missing profile data:
   - Check raw_user_meta_data in auth.users
   - Verify first_name and last_name are being passed correctly
2. Permission issues:
   - Verify SECURITY DEFINER is present
   - Check RLS policies on user_profiles

### Best Practices
1. Always include first_name and last_name in signup metadata
2. Monitor RAISE WARNING messages for potential issues
3. Use explicit schema references (public.user_profiles)
4. Maintain RLS policies on user_profiles table

### Security Considerations
1. SECURITY DEFINER ensures proper permissions
2. Explicit search_path prevents injection attacks
3. RLS policies control access to user_profiles
4. Non-blocking errors prevent user enumeration

### Related Tables
1. auth.users:
   - Source table for user data
   - Contains raw_user_meta_data with profile information
2. public.user_profiles:
   - Target table for profile data
   - Linked to auth.users via user_id
