function IngredientList(props) {
    const ingredientsListItems = props.ingredients.map((i) => {
        return (
            <li key={i}>{i}</li>
        )
    });
  return (
      <section>
          <h2>Ingredients on hand:</h2>
          <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
          {ingredientsListItems.length > 3 && <div className="get-recipe-container">
              <div ref={props.ref}>
                  <h3>Ready for a recipe?</h3>
                  <p>Generate a recipe from your list of ingredients.</p>
              </div>
              <button onClick={props.handleGetRecipe}>Get a recipe</button>
          </div>}
      </section>
  );
}

export default IngredientList;
