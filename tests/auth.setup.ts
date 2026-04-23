import {test as setup} from "@playwright/test";
import fs from "fs";

const authFile = ".auth/user.json";
const user = JSON.parse(fs.readFileSync(authFile, "utf-8"));

setup("authentication", async({page, request}) => {
    //get token
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {"user":{"email":"maxx@google.com","password":"maxxmaxx"}}
    });
    const responseBody = await response.json();
    const token = responseBody.user.token;

    user.origins[0].localStorage[0].value = token;
    fs.writeFileSync(authFile, JSON.stringify(user));

    process.env["ACCESS_TOKEN"] = token;

});
