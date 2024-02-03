const AWS = require("aws-sdk");

const uploadToS3 = async (data, filename) => {
    const BUCKET_NAME = 'expensetrackingappinfo';
    const IAM_USER_KEY = 'AKIAU4PFBJETTL7HUUO7';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log("Something went Wrong", err);
                reject(err)
            }
            else {
                // console.log("success", s3response)
                resolve(s3response.Location);
            }
        })
    })
}

module.exports = {
    uploadToS3
}