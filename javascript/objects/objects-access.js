// // 1. Dot property accessor
// // expression.identifier

// const hero = {
//     name: 'Batman'
//   };
  
// // Dot property accessor
// hero.name; // => 'Batman'


// // 2. Square brackets property accessor
// // expression[expression]
// const property = 'name';
// const hero = {
//   name: 'Batman'
// };

// // Square brackets property accessor:
// hero['name'];   // => 'Batman'
// hero[property]; // => 'Batman'

// 3. Object destructuring
// const { identifier } = expression;

const hero = {
    name: 'Batman'
  };
  
  // Object destructuring:
  const { name } = hero;
  name; // => 'Batman'

  // https://dmitripavlutin.com/access-object-properties-javascript/