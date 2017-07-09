const fs = require('fs');
const request = require('request');

const grab = (url) => {
    return new Promise((res, rej) => {
        const options = {
            url,
            headers: {
                'User-Agent': 'request'
            }
        }
        request(options, (error, response, body) => {
            if (error) console.log(error);
            else res(body);
        });
    })
}

const agregate = (json) => {
    const stars = json;

    const list = stars.map((repo) => {
        return `* [${repo.full_name}](${repo.html_url}) ${repo.description}`;
    });

    const data = list.join('\n');

    fs.writeFile('AWESOME.md', data);
}

const promises = [];

for (let i = 1; i <= 14; i++) {
    promises.push(
        grab(
            `https://api.github.com/users/luchanso/starred?page=${i}`,
        )
    );
}

Promise.all(promises)
    .then(results => {
        let result = [];
        results.forEach(res => {
            const r = JSON.parse(res);
            // console.log(r);
            result = result.concat(r);
        });
        // console.log(result);
        agregate(result);
    })
    .catch(console.error);

