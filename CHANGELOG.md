# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2025-01-12

### Fixed

-   Update expo and associated npm packages to fix build errors on EAS.

## [1.3.0] - 2025-01-12

### Added

-   Add `Dialog` component, which shows a modal with a cancel and confirm action.
-   Use `Dialog` in `HomeScreen` and `ListScreen` for asking user confirmation before deleting shooping lists and shopping list items.

### Fixed

-   Update expo version, and associated npm packages.
-   Use kebab-casing for file and directory names, so as to avoid file change issues between Windows and POSIX systems.
-   Update path aliases.
-   Rename the TS declaration files to regular TS script files, and export the types instead of declaring them, since these are for typing our own code, instead of some external code.

## [1.2.4] - 2024-07-30

### Fixed

-   Upgrade Node.js version to `20.16.0` in `.nvmrc`.

## [1.2.3] - 2024-07-30

### Fixed

-   Upgrade the Expo framework version to 51.
-   Upgrade npm depenedencies, in order to fix vulnerabilities.
-   Remove `eas-cli`, because of unfixable vulnerabilities with `dicer` and `semver`, so from now on, install and maintain the `eas-cli` globally.

## [1.2.2] - 2023-11-08

### Fixed

-   Upgrade expo to version 49, and perform required dependencies upgrades.
-   Fix issue, where on list views with more items than can be captured on screen at once, editing an item would be impossible, because the keyboard would close again automatically after tapping the edit icon.

## [1.2.1] - 2023-09-10

### Fixed

-   Add input blurring to the list name and list item name inputs when clicking other controls, and erase unsaved changes upon input blur.
-   Add mising `devDependencies` to `package.json`, `prettier`, `@typescript-eslint/parser`, `eslint`, and `eslint-config-prettier`.
-   Fix `.eslintrc`.
-   ([#1]) Fix bug, where the FlatList components in the shopping list and shopping list item screens would visibly remove the wrong item.
-   ([#3]) Fix issue where editing a shopping list item would not correctly set the new shopping list item value on first rerender.

## [1.2.0] - 2023-07-02

### Added

-   Add Expo packages to run the app on web as dev dependencies, to be able to profile rerenders.
-   Make existing shopping lists' names editable.
-   Make existing list items editable.

### Changed

-   Put screen components in their own directories, to organize them better

### Fixed

-   Put the content for the modal to add a new shopping list in its own component, so as to minimize the amount of full screen rerenders on input changes
-   Remove useMemo hook calls for creating Stylesheet objects, to put less stress on the app's memory.

## [1.1.0] - 2023-03-21

### Added

-   Add support for system light and dark theme.

### Fixed

-   With the addition of proper theme support, the text on screen background is now properly readable on devices with set for dark theme.

## [1.0.0] - 2023-03-20

### Added

-   First release; features:
    -   Maintain a list of shopping lists on `HomeScreen.tsx`;
    -   Add new shopping lists by entering a name for the list, and tapping the `"+ LIJSTJE AANMAKEN"`;
    -   Remove an existing shopping list, by tapping on the close icon on its list item card;
    -   Maintain a list of shopping items for an individual shopping on `ListScreen.tsx`;
    -   Add new shopping list items by entering a name for the item, and tapping the `"+ ARTIKEL TOEVOEGEN"` button;
    -   Remove an existing shopping list item, by tapping on the close icon on its list item card.

[1.2.1]: https://github.com/BenMerken/moms-shopping-list/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/BenMerken/moms-shopping-list/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/BenMerken/moms-shopping-list/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/BenMerken/moms-shopping-list/releases/tag/v1.0.0
[#1]: https://github.com/BenMerken/moms-shopping-list/issues/1
[#3]: https://github.com/BenMerken/moms-shopping-list/pull/3
