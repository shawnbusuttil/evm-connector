# Multi Wallet Connect

## Running The Project

- Run `npm install` and `npm run dev` to start up the project.
- Run `npm run test` to run tests.

## Future Improvements and Considerations

- There is some code duplication which can be extracted out into hooks or util functions and made to be more reusable.

- React Query can be integrated to allow for better handling of loading and error states. Also, caching responses which do not need to be real time.

- Missing logo for the native gas token in the list. The API call does not retreive the gas token so the image url needs to be fetched another way (e.g. switching to LiFi).

- Rendering optimizations and performance in the wallet component.

- Unit and integration tests, linting.

- UI improvements for transaction status (e.g. notifications).

- Environment variable for API key.
