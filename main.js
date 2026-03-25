#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const printRepos = async (username) => {
    const api = await fetch(`https://api.github.com/users/${username}/repos`);
    const repos = await api.json();
    
    for (const repo of repos) {
        console.log(repo.name);
    }

    return repos.map(repo => repo.name).join('\n');
};


rl.question('Github Username: ', async (username) => {
    if (!username) {
        console.log('Not a Valid Username');
        rl.close();
        return;
    }

    const repos = await printRepos(username);
    if (!fs.existsSync('./Users')) {
        fs.mkdir(path.join('./Users'), (err) => {
            if (err) console.log(err);
        });    
    }
    
    fs.writeFile(path.join(__dirname, './Users', `${username}.txt`), repos, (err) => {
        if (err) console.log(err);
        console.log('File Saved Successfully');
    });
    rl.close();
});