const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendImageGeneratedEmail = async (
  to,
  name,
  prompt,
  style,
  ratio,
  imageBase64
) => {
  await transporter.sendMail({
    from: `"Mini Creative Studio" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎨 Your AI Image Has Been Generated!",

    text: `
Hello ${name || "Creator"},

Your AI image has been generated successfully!

Prompt:
${prompt}

Style: ${style || "Default"}

Aspect Ratio: ${ratio || "1:1"}

Thank you for using Mini Creative Studio!

© 2026 Mini Creative Studio
    `,

    html: `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
/>

<title>Mini Creative Studio</title>

</head>

<body
style="
margin:0;
padding:0;
background:#eef2ff;
font-family:Arial,sans-serif;
">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="padding:40px 0;"
>

<tr>

<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"

style="
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 10px 35px rgba(0,0,0,.15);
">

<!-- HEADER -->

<tr>

<td

style="
padding:45px;
background:linear-gradient(
135deg,
#6C63FF,
#5A47FF
);

text-align:center;
color:white;
"

>

<h1
style="
margin:0;
font-size:34px;
font-weight:bold;
"
>

🎨 Mini Creative Studio

</h1>

<p
style="
margin-top:12px;
font-size:18px;
opacity:.95;
"
>

AI Image Generation Successful

</p>

</td>

</tr>

<!-- BODY -->

<tr>

<td
style="
padding:35px;
"
>

<h2
style="
margin-top:0;
color:#222;
"
>

Hello ${name || "Creator"} 👋

</h2>

<p
style="
font-size:16px;
line-height:30px;
color:#555;
"
>

We're excited to let you know that your AI image
has been generated successfully.

Below are the details.

</p>

<!-- DETAILS -->

<table
width="100%"
cellpadding="15"
cellspacing="0"

style="
background:#F6F7FF;
border-radius:12px;
margin-top:20px;
"

>

<tr>

<td width="50%">

<div
style="
font-size:14px;
color:#888;
"
>

🎭 STYLE

</div>

<div
style="
margin-top:10px;
font-size:18px;
font-weight:bold;
color:#222;
"
>

${style || "Default"}

</div>

</td>

<td width="50%">

<div
style="
font-size:14px;
color:#888;
"
>

📐 ASPECT RATIO

</div>

<div
style="
margin-top:10px;
font-size:18px;
font-weight:bold;
color:#222;
"
>

${ratio || "1:1"}

</div>

</td>

</tr>

</table>

<!-- PROMPT -->

<h3
style="
margin-top:35px;
margin-bottom:15px;
color:#444;
"
>

📝 Prompt

</h3>

<div

style="
background:#fafafa;
border-left:5px solid #6C63FF;
padding:18px;
border-radius:10px;
font-style:italic;
line-height:28px;
color:#444;
"

>

"${prompt}"

</div>

<!-- IMAGE -->

<div
style="
margin-top:35px;
text-align:center;
"
>

<img

src="cid:generatedImage"

alt="Generated Image"

style="
width:90%;
max-width:520px;
border-radius:16px;
border:1px solid #ddd;
box-shadow:0 6px 18px rgba(0,0,0,.18);
"

>

</div>
<!-- NEXT STEPS -->

<div
style="
margin-top:35px;
background:#FFF8E7;
border-radius:12px;
padding:25px;
"
>

<h3
style="
margin-top:0;
color:#222;
"
>

💡 What's Next?

</h3>

<ul
style="
padding-left:20px;
color:#555;
line-height:30px;
margin-bottom:0;
"
>

<li>Download your generated image.</li>

<li>Save it to your Collections.</li>

<li>Generate more AI artwork using new prompts.</li>

<li>Refine this prompt for even better results.</li>

</ul>

</div>

<!-- THANK YOU -->

<div
style="
margin-top:35px;
background:#F8F9FF;
border-radius:12px;
padding:25px;
text-align:center;
"
>

<h2
style="
margin:0;
color:#6C63FF;
"
>

🎉 Thank You!

</h2>

<p
style="
font-size:16px;
line-height:28px;
color:#555;
margin-top:15px;
"
>

Thank you for using
<strong>Mini Creative Studio</strong>.

We're excited to help you transform your ideas
into beautiful AI-generated artwork.

</p>

</div>

</td>

</tr>

<!-- FOOTER -->

<tr>

<td

style="
background:#6C63FF;
padding:30px;
text-align:center;
color:white;
"

>

<h3
style="
margin:0;
"
>

Mini Creative Studio

</h3>

<p
style="
margin-top:15px;
font-size:14px;
line-height:24px;
opacity:.9;
"
>

AI Image Generator built using

MERN Stack • AI APIs • MongoDB

</p>

<p
style="
font-size:12px;
margin-top:18px;
opacity:.75;
"
>

© 2026 Mini Creative Studio

<br>

This is an automated email.
Please do not reply.

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`,

    attachments: [
      {
        filename: "generated-image.png",
        content: imageBase64,
        encoding: "base64",
        cid: "generatedImage",
      },
    ],
  });
};

module.exports = {
  sendImageGeneratedEmail,
};