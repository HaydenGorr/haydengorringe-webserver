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
