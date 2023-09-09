# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.1] - WIP

### Fixed

-	Add input blurring to the list name and list item name inputs when clicking other controls, and erase unsaved changes upon input blur.	
-	Add mising `devDependencies` to `package.json`, `prettier`, `@typescript-eslint/parser`, `eslint`, and `eslint-config-prettier`.
-	Fix `.eslintrc`.

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
