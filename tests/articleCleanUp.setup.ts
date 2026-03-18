import { test as setup, expect } from '@playwright/test';


setup("delete article", async({request}) => {
    //delete article via api
        const delArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`);
        expect(delArticleResponse.status()).toEqual(204);
});