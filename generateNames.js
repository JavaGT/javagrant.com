var fs = require("fs");
var files = fs.readdirSync("./icon/photography");

console.log(
  files
    .map((filename) => {
      const stats = fs.lstatSync("./icon/photography/" + filename);
      return `  
  <div class="grid h item" category="">
    ${
      stats.isDirectory()
        ? fs
            .readdirSync("./icon/photography/" + filename)
            .map(
              (filename1) =>
                `
                  <a class="" href="/img/photography/${filename}/${filename1}" target="_blank">
                    <img src="/icon/photography/${filename}/${filename1}" class="item" />  
                  </a>
                `
            )
            .join("")
        : `
        <a href="/img/photography/${filename}" target="_blank">
          <img src="/icon/photography/${filename}" class="item" />
        </a>
        `
    }
    <div></div>
  </div>`;
    })
    .join("")
);
