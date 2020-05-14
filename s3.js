const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = function (req, res, next) {
    if (!req.file) {
        console.log("Multer did not work");
        res.json({ error: true });
        return;
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "vegetadorkelebucket",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();
    promise
        .then(() => {
            console.log("it worked!!!");
            next();
        })
        .catch((err) => {
            console.log(err);
            res.json({ error: true });
        });
};
