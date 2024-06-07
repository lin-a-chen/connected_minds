import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ipz202_gaa@student.ztu.edu.ua",
    pass: "sutupziwvkvpwjqm ",
  },
});

export async function sendVerificationEmail(email, token) {
  const verificationUrl = `http://localhost:3000/auth/activate/${token}`;
  const html = `<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:700px) {

			.desktop_hide table.icons-inner,
			.row-3 .column-1 .block-3.button_block .alignment a,
			.row-3 .column-1 .block-3.button_block .alignment div,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block div.fullWidth {
				max-width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.row-3 .column-1 .block-1.heading_block h1,
			.row-3 .column-1 .block-3.button_block .alignment {
				text-align: left !important;
			}

			.row-3 .column-1 .block-1.heading_block h1 {
				font-size: 20px !important;
			}

			.row-1 .column-1 .block-1.paragraph_block td.pad>div {
				text-align: center !important;
				font-size: 18px !important;
			}

			.row-3 .column-1 .block-2.paragraph_block td.pad>div {
				text-align: left !important;
				font-size: 14px !important;
			}

			.row-3 .column-1 .block-3.button_block a,
			.row-3 .column-1 .block-3.button_block div,
			.row-3 .column-1 .block-3.button_block span {
				font-size: 14px !important;
				line-height: 28px !important;
			}

			.row-3 .column-1 {
				padding: 0 24px 48px !important;
			}

			.row-4 .column-1 {
				padding: 32px 16px 48px !important;
			}
		}
	</style>
</head>
<body class="body" style="background-color: #f8f6ff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f6ff; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #a797ff; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 32px; padding-left: 48px; padding-right: 48px; padding-top: 32px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#ffffff;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:24px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:28.799999999999997px;">
<p style="margin: 0;">ConnectedMinds</p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #a797ff; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<!-- <div class="fullWidth" style="max-width: 639.2px;"><img alt="https://cdn3.iconfinder.com/data/icons/internet-security-124/512/InternetSecurity01.png" height="auto" src="/images/Email-Illustration.png" style="display: block; height: auto; border: 0; width: 100%;" title="An open email illustration" width="639.2"/></div> -->
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-left: 48px; padding-right: 48px; padding-top: 48px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="text-align:center;width:100%;padding-top:24px;">
<h1 style="margin: 0; color: #555555; font-size: 48px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 700; line-height: 150%; text-align: center; direction: ltr; letter-spacing: normal; margin-top: 0; margin-bottom: 0;">Привіт!</h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
<p style="margin: 0; margin-bottom: 16px;">Дякуємо, що зареєструвались на ConnectedMinds. Для завершення реєстрації натисність, будь ласка, кнопку нижче, щоб підтвердити вашу електронну пошту:</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="text-align:left;">
<div align="left" class="alignment">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${verificationUrl}" style="height:42px;width:174px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#f6a988">
<w:anchorlock/>
<center style="color:#ffffff;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;">Verify Email</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-- -->
<a href="${verificationUrl}" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#f6a988;border-radius:4px;width:auto;border-top:1px solid #f6a988;font-weight:700;border-right:1px solid #f6a988;border-bottom:1px solid #f6a988;border-left:1px solid #f6a988;padding-top:10px;padding-bottom:10px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:24px;padding-right:24px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Підтвердити email</span></span></a>
<!--<![endif]-->
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-left: 48px; padding-right: 48px; padding-top: 48px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
<p style="margin: 0; margin-bottom: 16px;">Якщо ви не реєструвались, просто проігноруйте цей лист.</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
<p style="margin: 0;"><br/>від команди ConnectedMinds</p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 48px; padding-right: 48px; padding-top: 24px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; padding-bottom: 24px; padding-top: 24px; text-align: center;">
<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="alignment" style="vertical-align: middle; text-align: center;">
<!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
<div class="fullWidth" style="max-width: 48px;"><img align="center" alt="LinkedIn" class="center" height="auto" src="/images/LinkedIn-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="LinkedIn" width="48"/></div>
</div> -->
<!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
<div class="fullWidth" style="max-width: 48px;"><img align="center" alt="Facebook" class="center" height="auto" src="/images/Facebook-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="Facebook" width="48"/></div>
</div> -->
<!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
<div class="fullWidth" style="max-width: 48px;"><img align="center" alt="Twitter" class="center" height="auto" src="/images/Twitter-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="Twitter" width="48"/></div>
</div> -->
<!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
<div class="fullWidth" style="max-width: 48px;"><img align="center" alt="Instagram" class="center" height="auto" src="/images/Instagram-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="Instagram" width="48"/></div>
</div> -->
<!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
<div class="fullWidth" style="max-width: 48px;"><img align="center" alt="YouTube" class="center" height="auto" src="/images/YouTube-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="YouTube" width="48"/></div>
</div> -->
</td>
</tr>
</table>
<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="alignment" style="vertical-align: middle; text-align: center;">
<!-- <div class="fullWidth" style="max-width: 100px;"><img align="center" alt="Company logo" class="center fullWidth" height="auto" src="" style="display: block; height: auto; border: 0; width: 100%; max-width: 100px;" title="Company logo" width="100"/></div> -->
</td>
</tr>
</table>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 48px; padding-right: 48px; padding-top: 24px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad">
<div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:18px;">
<p style="margin: 0;">ConnectedMinds, 1234 Street, City, State, 12345</p>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</body>
</html>
</code></pre>
</body>
</html>`;

  await transporter.sendMail({
    from: '"ConnectedMinds" <ipz202@student.ztu.edu.ua>',
    to: email,
    subject: "Підтвердіть свою пошту",
    html: html
  });
}


export async function sendMail(email, heading, ifWrongUserMessage, text) {
	const url = `http://localhost:3000`;
	const html = `<!DOCTYPE html>
  
  <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
  <title></title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->
  <style>
		  * {
			  box-sizing: border-box;
		  }
  
		  body {
			  margin: 0;
			  padding: 0;
		  }
  
		  a[x-apple-data-detectors] {
			  color: inherit !important;
			  text-decoration: inherit !important;
		  }
  
		  #MessageViewBody a {
			  color: inherit;
			  text-decoration: none;
		  }
  
		  p {
			  line-height: inherit
		  }
  
		  .desktop_hide,
		  .desktop_hide table {
			  mso-hide: all;
			  display: none;
			  max-height: 0px;
			  overflow: hidden;
		  }
  
		  .image_block img+div {
			  display: none;
		  }
  
		  @media (max-width:700px) {
  
			  .desktop_hide table.icons-inner,
			  .row-3 .column-1 .block-3.button_block .alignment a,
			  .row-3 .column-1 .block-3.button_block .alignment div,
			  .social_block.desktop_hide .social-table {
				  display: inline-block !important;
			  }
  
			  .icons-inner {
				  text-align: center;
			  }
  
			  .icons-inner td {
				  margin: 0 auto;
			  }
  
			  .image_block div.fullWidth {
				  max-width: 100% !important;
			  }
  
			  .mobile_hide {
				  display: none;
			  }
  
			  .row-content {
				  width: 100% !important;
			  }
  
			  .stack .column {
				  width: 100%;
				  display: block;
			  }
  
			  .mobile_hide {
				  min-height: 0;
				  max-height: 0;
				  max-width: 0;
				  overflow: hidden;
				  font-size: 0px;
			  }
  
			  .desktop_hide,
			  .desktop_hide table {
				  display: table !important;
				  max-height: none !important;
			  }
  
			  .row-3 .column-1 .block-1.heading_block h1,
			  .row-3 .column-1 .block-3.button_block .alignment {
				  text-align: left !important;
			  }
  
			  .row-3 .column-1 .block-1.heading_block h1 {
				  font-size: 20px !important;
			  }
  
			  .row-1 .column-1 .block-1.paragraph_block td.pad>div {
				  text-align: center !important;
				  font-size: 18px !important;
			  }
  
			  .row-3 .column-1 .block-2.paragraph_block td.pad>div {
				  text-align: left !important;
				  font-size: 14px !important;
			  }
  
			  .row-3 .column-1 .block-3.button_block a,
			  .row-3 .column-1 .block-3.button_block div,
			  .row-3 .column-1 .block-3.button_block span {
				  font-size: 14px !important;
				  line-height: 28px !important;
			  }
  
			  .row-3 .column-1 {
				  padding: 0 24px 48px !important;
			  }
  
			  .row-4 .column-1 {
				  padding: 32px 16px 48px !important;
			  }
		  }
	  </style>
  </head>
  <body class="body" style="background-color: #f8f6ff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
  <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f6ff; background-image: none; background-position: top left; background-size: auto; background-repeat: no-repeat;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #a797ff; color: #000000; width: 680px; margin: 0 auto;" width="680">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 32px; padding-left: 48px; padding-right: 48px; padding-top: 32px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#ffffff;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:24px;font-weight:700;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:28.799999999999997px;">
  <p style="margin: 0;">ConnectedMinds</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #a797ff; border-radius: 0; color: #000000; width: 680px; margin: 0 auto;" width="680">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
  <div align="center" class="alignment" style="line-height:10px">
  <!-- <div class="fullWidth" style="max-width: 639.2px;"><img alt="https://cdn3.iconfinder.com/data/icons/internet-security-124/512/InternetSecurity01.png" height="auto" src="/images/Email-Illustration.png" style="display: block; height: auto; border: 0; width: 100%;" title="An open email illustration" width="639.2"/></div> -->
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-left: 48px; padding-right: 48px; padding-top: 48px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad" style="text-align:center;width:100%;padding-top:24px;">
  <h1 style="margin: 0; color: #555555; font-size: 48px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-weight: 700; line-height: 150%; text-align: center; direction: ltr; letter-spacing: normal; margin-top: 0; margin-bottom: 0;">${heading}</h1>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
  <p style="margin: 0; margin-bottom: 16px;">${text}</p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="button_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="text-align:left;">
  <div align="left" class="alignment">
  <!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:42px;width:174px;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#f6a988">
  <w:anchorlock/>
  <center style="color:#ffffff;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;">Перейти на сайт</center>
  </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-- -->
  <a href="${url}" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#f6a988;border-radius:4px;width:auto;border-top:1px solid #f6a988;font-weight:700;border-right:1px solid #f6a988;border-bottom:1px solid #f6a988;border-left:1px solid #f6a988;padding-top:10px;padding-bottom:10px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:24px;padding-right:24px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Перейти на сайт</span></span></a>
  <!--<![endif]-->
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 48px; padding-left: 48px; padding-right: 48px; padding-top: 48px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
  <p style="margin: 0; margin-bottom: 16px;">${ifWrongUserMessage}</p>
  </div>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:24px;">
  <p style="margin: 0;"><br/>від команди ConnectedMinds</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 48px; padding-right: 48px; padding-top: 24px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px; padding-bottom: 24px; padding-top: 24px; text-align: center;">
  <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="alignment" style="vertical-align: middle; text-align: center;">
  <!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
  <div class="fullWidth" style="max-width: 48px;"><img align="center" alt="LinkedIn" class="center" height="auto" src="/images/LinkedIn-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="LinkedIn" width="48"/></div>
  </div> -->
  <!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
  <div class="fullWidth" style="max-width: 48px;"><img align="center" alt="Facebook" class="center" height="auto" src="/images/Facebook-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="Facebook" width="48"/></div>
  </div> -->
  <!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
  <div class="fullWidth" style="max-width: 48px;"><img align="center" alt="Twitter" class="center" height="auto" src="/images/Twitter-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="Twitter" width="48"/></div>
  </div> -->
  <!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
  <div class="fullWidth" style="max-width: 48px;"><img align="center" alt="Instagram" class="center" height="auto" src="/images/Instagram-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="Instagram" width="48"/></div>
  </div> -->
  <!-- <div class="img-container center fixedwidth" style="padding-right: 20px;display:inline;float:none;">
  <div class="fullWidth" style="max-width: 48px;"><img align="center" alt="YouTube" class="center" height="auto" src="/images/YouTube-Logo.png" style="display: block; height: auto; border: 0; width: 100%;" title="YouTube" width="48"/></div>
  </div> -->
  </td>
  </tr>
  </table>
  <table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tr>
  <td class="alignment" style="vertical-align: middle; text-align: center;">
  <!-- <div class="fullWidth" style="max-width: 100px;"><img align="center" alt="Company logo" class="center fullWidth" height="auto" src="" style="display: block; height: auto; border: 0; width: 100%; max-width: 100px;" title="Company logo" width="100"/></div> -->
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </table>
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
  <tbody>
  <tr>
  <td>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
  <tbody>
  <tr>
  <td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 24px; padding-left: 48px; padding-right: 48px; padding-top: 24px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
  <table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
  <tr>
  <td class="pad">
  <div style="color:#555555;direction:ltr;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;mso-line-height-alt:18px;">
  <p style="margin: 0;">ConnectedMinds, 1234 Street, City, State, 12345</p>
  </div>
  </td>
  </tr>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  </body>
  </html>
  </code></pre>
  </body>
  </html>`;
  
	await transporter.sendMail({
	  from: '"ConnectedMinds" <ipz202@student.ztu.edu.ua>',
	  to: email,
	  subject: "Вас призначено адміністратором",
	  html: html
	});
  }
