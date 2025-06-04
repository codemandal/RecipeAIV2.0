
function ClaudeRecipe(props) {
    const details = props.recipe.ingredients && props.recipe.ingredients.map((item, index) => (
        <li key={index}>{item.quantity} {item.unit} {item.name} </li>
    ))
    const steps = props.recipe.instructions && props.recipe.instructions.map((item, index) => (
        <li key={index}>{item}</li>
    ))
    return (

        <section className="suggested-recipe-container" aria-live="polite">
          <h2>Chef Claude Recommends:</h2>
          <article className="suggested-recipe-container" aria-live="polite">
              <h3>Title: {props.recipe.title}</h3>
              <span>Prep Time: {props.recipe.prep_time_minutes}</span>
              <span>Cook Time: {props.recipe.cook_time_minutes} </span>
              <ol>
                  {details}
              </ol>
              <hr/>
              <ol>
                  {steps}
              </ol>
              
          </article>
      </section>
  );
}

export default ClaudeRecipe;