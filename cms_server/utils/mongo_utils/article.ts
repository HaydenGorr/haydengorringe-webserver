import { article, api_return_schema } from "../../interfaces/interfaces";
import article_schema from "../../mongo_schemas/article_schema";
import { MONOGDB_ARTICLES } from '../path_consts.js'
import dbConnect from '../db_conn';

function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export async function get_article(article_dir_name:string){

    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)

    try {
        const article = await article_schema(connection).find({source: article_dir_name});
        return article
    } catch (error) {
        console.error('Error:', error);
        return 'Internal server error'
    }
}

export async function get_all_articles(): Promise<api_return_schema<article[]>>{
  try {
      const connection = await dbConnect(process.env.DB_ARTICLES_NAME)
      const articles: any[] = await article_schema(connection).find().sort({ publishDate: -1 });
      return {data: articles, error:{has_error: false, error_message: ""}}
  } catch (error) {
      console.error('Error:', error);
      return {data: [], error:{has_error: true, error_message: `${error}`}}
  }
}

export async function get_all_ready_articles(){
  const connection = await dbConnect(process.env.DB_ARTICLES_NAME)

  try {
    const articles = await article_schema(connection).find({ ready: true }).sort({ publishDate: -1 });
    return {"error": "", "data":articles}
  } catch (error) {
    return {"error": "Could not fetch Article data from DB", "data":[]}
  }
}

export async function add_article(source_folder: string){

    console.log("creating chip")

    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)
  
    try {
        const ArticleModel = article_schema(connection);

        const newArticle = new ArticleModel({
            title: "template title",
            desc: "template definition",
            infoText: "template infoText",
            chips: [],
            source: generateRandomString(8),
            views: 0,
            publishDate: new Date(),
            ready: false,
            portfolioReady: false
        });

        const asd = await newArticle.save();

        return asd;
    } catch (error) {
        console.error('Error:', error);
    }

}

export async function delete_article(articleId: number) {
    try {
      const connection = await dbConnect(process.env.DB_ARTICLES_NAME);
      console.log("AH!")
      const Article = await article_schema(connection); // If your model needs a connection to initialize
      console.log("\ndeleting")
      const result = await Article.findByIdAndDelete(articleId);
      console.log("\ndeleted")
      if (!result) {
        return { success: false, message: "Article not found" };
      }
      return { success: true, message: "Article deleted successfully" };
    } catch (error) {
      return { success: false, message: "could not delete article" };
    }
  }

export const updatedArticle = async({ title, desc, category, infoText, chips, source, views, publishDate, ready, portfolioReady}: article) => {
    const connection = await dbConnect(process.env.DB_ARTICLES_NAME)

    try {
        const articleModel = await article_schema(connection)

        // const updated_article = await articleModel.findByIdAndUpdate(
        //     databaseID, // the _id of the document to update
        //     { $set: { title: title, desc: desc, category: category, infoText: infoText, chips: chips, source: source, views: views, publishDate: publishDate, ready: ready, portfolioReady: portfolioReady } }, // the update operations
        //     { new: true } // return the updated document
        // );

        // console.log("updated, ", updated_article)

        // return updated_article;
    }
    catch {
        console.log("tractor")
        // console.error('Error:', error);
        return 'Internal server error';
    }
}

/**
 * Takes a new article in cms_data, validates it and adds it to the database
 * @param {String} article_dir_name - The name of the dir containing the article you're creating
 */
export async function create_article(article: any){

  // const article_dir_name = article

  // console.log("creating article: ", article)

  // const new_article_path = path.join(articles_dir, article_dir_name);

  // /**
  //  * This will return false, true, or an array of props.
  //  * it returns an array of props if the article has already been published AND
  //  * the meta.file doesn't match the DB entry. This means that the article has been
  //  * updated locally and this update needs to be reflected in the DB
  //  */
  // const result = await validate_article_before_publishing(new_article_path, article_dir_name)

  // // If result is false. validate_article_before_publishing() should never return an empty array
  // if(!result) return false

  // const article_meta = await readJSON(path.join(new_article_path, "meta.json"))

  // if (typeof result == "object") {
  //   console.log("This article has already been published, but there are updates to commit")
  //   console.log("The updates: ", result)
  //   await update_article(article_dir_name, result, article_meta)
  // }else {
  //   // Create a whole new article record
  //   dbConnect(process.env.DB_ARTICLES_NAME)
  //   .then((conn) => {
        
  //       // Create a new document
  //       const newArticle = new Article(conn)({
  //       title: article_meta.title,
  //       desc: article_meta.desc,
  //       infoText: article_meta.infoText,
  //       chips: article_meta.chips,
  //       source: article_dir_name,
  //       views: 0,
  //       publishDate: Date.now(),
  //       ready: true
  //       });
        
  //       // Save the document
  //       return newArticle.save();
  //   })
  //   .then(() => {
  //       console.log('Document inserted successfully');
  //   })
  //   .catch((err) => {
  //       console.error('Error:', err);
  //   });
  // }

  return

  // // Add the chips
  // const new_defs = await get_definitions_for_new_chips(article_meta.chips)

  // // Ensure the chips has definitions
  // for (const chip of new_defs) {
  //     await add_chip(chip.name, chip.description)
  // }
}