# Auction Frontend

## How to run
### Prerequisites
- npm
- running backend on port `3000`

### Steps

1. Execute `npm install` to install npm package (if you haven't)
2. Execute `npm run start` to run the react app
3. It should run on port `8000`

## Notes
- You can see `./documentation/screenshots` to see what the pages look like
- Code is made as simple as possible, so other people can read and develop it more with ease. It won't use any framework or package if it's not really necessary

## Things to Improve
- Some usecase need to transform or merge result from several API call. Need to wrap those inside `repositories` so we can reause it across many react component
- We can use https://mqtt.org/ to send realtime bid data. Need to revamp the UI also such as placing bid flow inside item detail
- Integration with `logging` service
- Implement unit test
- Setup deployment pipeline