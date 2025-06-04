import React from "react"
import ClaudeRecipe from './ClaudeRecipe'
import IngredientList from './IngredientList'
//import { getRecipeFromMistral } from "../ai"
import { getRecipeChat } from "../ai"
function Main() {
    const [ingredients, setIngredients] = React.useState(
        ["all the main spices"]
    )
   // const [recipeShown, setRecipeShown] = React.useState(false)
    const [recipe, setRecipe] = React.useState({})
    const recipeSection = React.useRef(null)
    function submitForm(formData) {

        const newIngredient = formData.get("ingredient")
        setIngredients(
            prev => [
                ...prev,
                newIngredient
            ])
    }
    async function getRecipe() {
       // setRecipeShown(prev => !prev)
        //const recipeMarkdown  = await getRecipeFromMistral(ingredients)
        const recipeMarkdown = await getRecipeChat(ingredients)
        console.log(recipeMarkdown)
        setRecipe(recipeMarkdown)
        //setRecipe(recipeMarkdown)
        
    }
    React.useEffect(() => {

        if (recipeSection.current !== null) {
            recipeSection.current.scrollIntoView()
        }

    },[recipe])
    return (
        <main>
            <form className="add-ingredient-form" action={submitForm}>
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />

                <button>Add ingredient</button>

            </form>
            {ingredients.length > 0 &&
                <IngredientList ref={recipeSection} ingredients={ingredients}  handleGetRecipe={getRecipe} />
            }
            {
               recipe && < ClaudeRecipe recipe={recipe} />
            }
      </main>
  );
}

export default Main;