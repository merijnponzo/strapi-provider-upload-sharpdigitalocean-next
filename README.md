# strapi-provider-upload-sharpdigitalocean-next

```
yarn add strapi-provider-upload-sharpdigitalocean-next
```

or

```

```

npm install strapi-provider-upload-sharpdigitalocean-next

```


This plugin resizes and optimize your image to you custom wishes
And it creates one image variant, a thumbnail, also available in your upload_file model
by the property 'thumb'

### In strapi settings, go to medialibrary:

- turn Enable responsive friendly upload to OFF
- turn Enable size optimization (without quality loss) to OFF

add

```

"thumb": {
"type": "string",
"configurable": false,
"required": true
},

```

to extensions/upload/models/File.settings.json

add

```

upload: {
provider: "sharpdigitalocean-next",
providerOptions: {
accessKeyId: "YOUR_ACCESS_KEY_ID",
secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
endpoint: "YOUR_SPACE_ENDPOINT eg ny1.digitaloceanspaces.com",
optimize: {
size: 1000,
thumbnail_size: 500,
},
settings: {
awsUploadFolder: "CUSTOM_FOLDER_NAME_IN_YOUR_BUCKET",
},
params: {
Bucket: "YOUR_SPACE_BUCKET_NAME",
},
},
},

```

to config/ENV/plugins.js
```
