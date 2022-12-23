import { readFile } from "fs";
import dotenv from "dotenv";
dotenv.config();
import { Client, APIErrorCode } from "@notionhq/client";
const notion = new Client({ auth: process.env.TOKEN });

const databaseId = process.env.DATABASE_ID;

async function addEntry(title, clips, author, dataAddet) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "Clippings": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": clips
              }
            }
          ]
        },
        "Date Clipped": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": dataAddet
              }
            }
          ]
        },
        "Author": {
          "rich_text": [
            {
              "type": "text",
              "text": {
                "content": author
              }
            }
          ]
        },
        title: { 
          title:[
            {
              "text": {
                "content": title
              }
            }
          ]
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

var clippings = readFile('./My Clippings.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
  }
  const ctx = new String(data).split('==========');
  for(var i = 0; i<=(ctx.length-2); i++){
    var title = new String(ctx[i]).split("(")[0]
    var author = new String(ctx[i]).split("(")[2].split(")")[0]
    var dataAddet = new String(ctx[i]).split("|")[2].split("\n")[0]
    if(new String(ctx[i]).split(":")[3] != undefined){
      var clip = new String(ctx[i]).split(":")[3];
    } else {
      var clip = new String(ctx[i]).split(":")[2]
    }
    var clip = clip.slice(6);
    addEntry(title, clip, author, dataAddet)
  }
});