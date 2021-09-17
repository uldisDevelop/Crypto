import { ApolloClient, gql, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  cache: new InMemoryCache(),
});

const helper = {
  fetch(data: { query: string }): any {    
    return new Promise((resolve) => {
      client
        .query({
          query: gql`
            ${data.query}
          `,
        })
        .then((result) => {          
          resolve(result);
        });
    });
  },
  timeConverter: (UNIX_timestamp: number, mode: 'date' | 'day'): String => {
    const dateObj = new Date(UNIX_timestamp * 1000);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];    
    const month = months[dateObj.getMonth()];
    const date = dateObj.getDate();

    if (mode === 'date') {
      return `${month} ${date}`;
    }
    return dateObj.toLocaleDateString(undefined, { weekday: 'long' }).substring(0, 3);
  },
  formatMoney:(value:number)=>{
    return (value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }); 
  }
};

export default helper;
