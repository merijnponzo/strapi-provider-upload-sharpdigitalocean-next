'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const AWS = require('aws-sdk');
const Sharp = require('sharp');

module.exports = {
    init({
        optimize,
        settings,
        ...config
    }) {
        const S3 = new AWS.S3({
            apiVersion: "2006-03-01",
            ...config,
        });

        return {
            upload(file, customParams = {}) {
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : '';
                    Sharp(file.buffer)
                        .toFormat('jpeg')
                        .jpeg({
                            quality: 90,
                            progressive: true
                        })
                        .resize(optimize.size, null)
                        .toBuffer()
                        .then(buffer => {
                            var params = {
                                Key: `${settings.awsUploadFolder}/${path}${file.hash}${file.ext}`,
                                Body: Buffer.from(buffer, "binary"),
                                ACL: "public-read",
                                ContentType: file.mime,
                                ...customParams,
                            };

                            S3.upload(params, (err, data) => {
                                if (err) {
                                    return reject(err);
                                }
                                file.url = data.Location;
                                console.log('image uploaded to:'+file.url)
                                // Creates the thumbnail
                                Sharp(buffer)
                                    .toFormat('jpeg')
                                    .jpeg({
                                        quality: 90,
                                        progressive: true
                                    })
                                    .resize(optimize.thumbnail_size,null)
                                    .toBuffer()
                                    .then(buffer => {
                                        // thumbnail t_
                                        var params = {
                                            Key: `${settings.awsUploadFolder}/${path}t_${file.hash}${file.ext}`,
                                            Body: Buffer.from(buffer, "binary"),
                                            ACL: "public-read",
                                            ContentType: file.mime,
                                            ...customParams,
                                        };

                                        S3.upload(params, (err, data) => {
                                            if (err) {
                                                return reject(err);
                                            }
                                            file.thumb = data.Location;
                                            console.log('thumbnail uploaded to:'+file.url)
                                            resolve();
                                        });
                                    })
                                    .catch(err => reject(err));
                            });
                        })
                        .catch(err => reject(err));
                });
            },
            delete: file => {
                return new Promise((resolve, reject) => {
                    const path = file.path ? `${file.path}/` : '';
                    S3.deleteObject({
                            Key: `${path}${file.hash}${file.ext}`
                        },
                        (err, data) => {
                            if (err) {
                                return reject(err);
                            }
                            resolve();
                        }
                    );
                });
            }
        };
    }
};