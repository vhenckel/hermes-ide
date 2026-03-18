## New
- Plugins now require explicit approval before installation when they request permissions — a confirmation dialog shows what each permission allows
- Plugin permissions are now enforced on the server side, preventing any bypass of the permission system

## Improved
- Permission descriptions in the Plugin Manager now show human-readable explanations instead of raw permission names
- Plugins that include user-configurable settings no longer need to manually declare storage access — it is granted automatically

## Fixed
- A plugin can no longer impersonate another plugin by registering under a different name
