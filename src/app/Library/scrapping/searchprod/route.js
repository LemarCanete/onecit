import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio"

export async function POST(request) {
    const { search: userSearch, goto, searchElement, titleElement, authorElement, imageElement, dateElement, descriptionElement, linkElement } = await request.json();

    if (!userSearch) {
        return NextResponse.json("Please provide a search prompt");
    }

    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();
        await page.setViewport({width: 2560, height: 1953});

        await page.goto(goto);
        await page.type(searchElement, userSearch); // Assuming '.input' is the correct selector for the search input field

        await page.keyboard.press("Enter")


        await page.waitForNavigation();

        const html = await page.content();
        const $ = cheerio.load(html)

        const titles = $(titleElement).map((index, elem)=>{
            const title = $(elem).text();
            return title
        }).get()
        const authors = $(authorElement).map((index, elem)=>{
            return $(elem).text();
        }).get()
        const images = $(imageElement).map((index, elem)=>{
            return $(elem).attr('src');
        }).get()
        const dates = $(dateElement).map((index, elem)=>{
            return $(elem).text();
        }).get()
        const descriptions = $(descriptionElement).map((index, elem)=>{
            return $(elem).text();
        }).get()
        const links = $(linkElement).map((index, elem)=>{
            return $(elem).attr('href');
        }).get()

        const results = [];

        for(let i = 0; i < titles.length; i++){
            const item = {
                title: titles[i],
                author: authors[i],
                image: images[i],
                date: dates[i],
                description: descriptions[i],
                link: links[i]
            }
            results.push(item);
        }
        
        return NextResponse.json({results})

    } catch (err) {
        NextResponse.json({err: `An error occured ${err.message}`})
    } finally {
        if (browser) {
            await browser.close();
        }
    }

}
