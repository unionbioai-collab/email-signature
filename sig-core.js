/* sig-core.js — 서명 HTML 생성 공통 로직 (index.html / admin.html 공유)
   템플릿 기준: 2025 UNION biometrics 리브랜딩 서명 */
(function(global){
  "use strict";

  /* 템플릿 고정 색상 */
  var C_DEPT  = "#003da6";  /* 부서 / 웹사이트 */
  var C_LABEL = "#0000ff";  /* T/M/E/A 텍스트 라벨 */
  var C_TEXT  = "#101010";  /* 본문 */
  var C_LINE  = "#003da6"; /* 헤더 하단 구분선 — 로고/브랜드 블루 */

  var SNS_ICONS = {
    fb: "https://www.mail-signatures.com/signature-generator/img/templates/brands-voice/fb.png",
    yt: "https://www.mail-signatures.com/signature-generator/img/templates/brands-voice/yt.png",
    ln: "https://www.mail-signatures.com/signature-generator/img/templates/brands-voice/ln.png"
  };

  function esc(s){
    return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function resolveIconBase(iconBase){
    if (iconBase === "auto") {
      if (location.protocol === "http:" || location.protocol === "https:") {
        return new URL("icons/", location.href).href;
      }
      return "";
    }
    return iconBase || "";
  }

  function plain(text){
    return '<span style="font-size:9pt;line-height:10pt;color:' + C_TEXT + ';font-family:굴림체;">' + esc(text) + '</span>';
  }

  function contactRow(iconUrl, iconBase, key, label, inner){
    var src = iconUrl || (iconBase ? iconBase.replace(/\/+$/, "") + "/icon-" + key + ".png" : "");
    var lead;
    if (src) {
      lead = '<img src="' + esc(src) + '" width="12" height="12" alt="' + label + '" '
        + 'style="border:0;width:12px;height:12px;vertical-align:-2px;" />&nbsp;';
    } else {
      lead = '<span style="font-size:9pt;line-height:10pt;color:' + C_LABEL + ';font-weight:bold;font-family:굴림체;">' + label + ':</span>';
    }
    return '<p style="padding-bottom:3px;margin-bottom:0px;padding-top:0px;margin-top:0px;line-height:12pt;font-family:굴림체;font-size:9pt;color:rgb(0,0,0);">'
      + lead + inner + '</p>';
  }

  function snsIcon(href, src, alt){
    return '<a href="' + esc(href) + '" target="_blank" rel="noopener">'
      + '<img border="0" width="20" alt="' + alt + '" style="border:0;vertical-align:middle;height:20px;width:20px;" src="' + esc(src) + '" /></a>&nbsp;';
  }

  /**
   * v: { name, nameEn, dept, tel, mobile, email } — 개인 항목
   * c: config.json — 회사 공통 항목
   */
  function buildSignature(v, c){
    var ib = resolveIconBase(c.iconBase);

    /* ── 연락처 ── */
    var rows = "";
    if (v.tel)    rows += contactRow(c.iconTel, ib, "tel", "T", plain(v.tel));
    if (v.mobile) rows += contactRow(c.iconMobile, ib, "mobile", "M", plain(v.mobile));
    if (v.email)  rows += contactRow(c.iconEmail, ib, "email", "E",
      '<a href="mailto:' + esc(v.email) + '" style="text-decoration:none;font-size:9pt;line-height:10pt;color:' + C_TEXT + ';">'
      + '<span style="text-decoration:none;font-size:9pt;line-height:10pt;color:' + C_TEXT + ';font-family:굴림체;">' + esc(v.email) + '</span></a>');
    if (c.siteText) rows += contactRow(c.homeIcon, ib, "home", "H",
      '<a href="' + esc(c.siteUrl || ("https://" + c.siteText)) + '" target="_blank" rel="noopener" style="text-decoration:none;font-size:9pt;line-height:10pt;color:' + C_TEXT + ';">'
      + '<span style="text-decoration:none;font-size:9pt;line-height:10pt;color:' + C_TEXT + ';font-family:굴림체;">' + esc(c.siteText) + '</span></a>');
    var addrInner = "";
    if (v.addrLang === "en")       addrInner = c.addrEn ? plain(c.addrEn) : "";
    else if (v.addrLang === "both") {
      if (c.addrKo) addrInner += plain(c.addrKo);
      if (c.addrKo && c.addrEn) addrInner += '<br />';
      if (c.addrEn) addrInner += plain(c.addrEn);
    }
    else                            addrInner = c.addrKo ? plain(c.addrKo) : "";
    if (addrInner) rows += contactRow(c.iconAddr, ib, "addr", "A", addrInner);

    /* ── SNS ── */
    var sns = "";
    if (c.fb) sns += snsIcon(c.fb, c.snsFbIcon || SNS_ICONS.fb, "facebook icon");
    if (c.yt) sns += snsIcon(c.yt, c.snsYtIcon || SNS_ICONS.yt, "youtube icon");
    if (c.ln) sns += snsIcon(c.ln, c.snsLnIcon || SNS_ICONS.ln, "linkedin icon");
    if (sns) sns =
      '<p style="margin:4px 0px 0px;padding:0px;font-family:굴림체;font-size:9pt;color:rgb(0,0,0);line-height:1.2;">'
      + sns + '</p>';

    /* ── 헤더: 이름(국문+영문) / 부서 | 직책 ── */
    var fullName = esc(v.name) + (v.nameEn ? "&nbsp;" + esc(v.nameEn) : "");
    var titlePart = "";
    if (v.title) titlePart =
      '<span style="font-size:10pt;color:' + C_DEPT + ';font-family:굴림체;">&nbsp;|&nbsp;</span>'
      + '<span style="font-size:10pt;color:' + C_DEPT + ';font-family:굴림체;">' + esc(v.title) + '</span>';

    /* ── 로고 + 캡션 ── */
    var logoCell = "";
    if (c.logo) {
      logoCell =
        '<p style="text-align:center;font-size:10pt;font-family:arial,sans-serif;line-height:1.2;margin:0px;">'
        + '<a href="' + esc(c.siteUrl || "#") + '" target="_blank">'
        + '<img border="0" alt="Logo" src="' + esc(c.logo) + '" style="width:110px;border:0;" /></a></p>';
      if (c.logoCaption) logoCell +=
        '<p style="text-align:center;font-size:10pt;font-family:arial,sans-serif;line-height:1.2;margin:6px 0px 0px;">'
        + '<span style="font-family:\'맑은 고딕\',sans-serif;font-size:9pt;color:#858585;font-weight:bold;">' + esc(c.logoCaption) + '</span></p>';
    }

    var html =
'<table cellspacing="0" cellpadding="0" border="0" style="font-family:arial,sans-serif;color:rgb(0,0,0);max-width:728px;margin-left:0px;margin-right:auto;width:599px;overflow-wrap:break-word;word-break:normal;">\n'
+ '<colgroup><col style="width:130px;" /><col style="width:469px;" /></colgroup>\n'
+ '<tbody>\n'
+ '<tr>\n'
+ '  <td colspan="2" style="margin:0px;padding:0px 0px 4px;border-bottom:1px solid ' + C_LINE + ';width:599px;height:45px;">\n'
+ '    <p style="margin:0px;padding:0px;color:rgb(0,0,0);font-size:10pt;font-family:arial,sans-serif;line-height:1.2;">'
+      '<span style="font-weight:700;font-size:18pt;font-family:arial,sans-serif;color:#000000;">' + fullName + '</span><br />'
+      '<span style="font-family:굴림체;font-size:10pt;color:' + C_DEPT + ';">' + esc(v.dept) + '</span>' + titlePart + '</p>\n'
+ '  </td>\n'
+ '</tr>\n'
+ '<tr>\n'
+ '  <td style="margin:0px;padding:0px;width:130px;height:105px;vertical-align:middle;">\n'
+      logoCell + '\n'
+ '  </td>\n'
+ '  <td style="margin:0px;padding:25px 0px 0px;width:469px;height:102px;vertical-align:top;">\n'
+      rows + sns + '\n'
+ '  </td>\n'
+ '</tr>\n'
+ '</tbody>\n'
+ '</table>\n';

    /* 배너: v.banner = "ko" | "en" | "none" (기본 ko) */
    var bannerUrl = "";
    var sel = v.banner || "ko";
    if (sel === "ko") bannerUrl = c.bannerKo || "";
    else if (sel === "en") bannerUrl = c.bannerEn || "";
    if (bannerUrl) {
      html +=
'<p style="margin:0px;padding:0px;font-family:굴림체;font-size:9pt;color:rgb(0,0,0);line-height:1.2;"><br /></p>\n'
+ '<p style="margin:0px;padding:0px;line-height:1.2;">'
+ '<a href="' + esc(c.siteUrl || "#") + '" target="_blank">'
+ '<img alt="banner" src="' + esc(bannerUrl) + '" style="width:600px;height:150px;border:0;vertical-align:middle;" /></a></p>\n';
    }
    return html;
  }

  /* 기본값 (config.json 로드 실패 시 폴백) */
  var DEFAULT_CONFIG = {
    siteText: "unionbiometrics.com",
    siteUrl: "https://unionbiometrics.com",
    addrKo: "05836 서울특별시 송파구 법원로 127, 문정대명벨리온 12층",
    addrEn: "12F, Daemyung Valeon bldg, 127, Beobwon-ro, 05836, Songpa-Gu, Seoul, Republic of Korea",
    logo: "https://unionbiometrics.com/img/ci/UNION%20biometrics%20CI.png",
    logoCaption: "",
    bannerKo: "https://unionbiometrics.com/wp-content/uploads/logo/email_kor.gif",
    bannerEn: "https://unionbiometrics.com/img/email-signature/banner/ci/email-eng.gif",
    iconTel: "https://unionbiometrics.com/img/email-signature/telephone.png",
    iconMobile: "https://unionbiometrics.com/img/email-signature/mobile.png",
    iconEmail: "https://unionbiometrics.com/img/email-signature/email.png",
    iconAddr: "https://unionbiometrics.com/img/email-signature/address.png",
    homeIcon: "https://unionbiometrics.com/img/email-signature/homepage.png",
    snsFbIcon: "https://unionbiometrics.com/img/email-signature/facebook.png",
    snsYtIcon: "https://unionbiometrics.com/img/email-signature/youtube.png",
    snsLnIcon: "https://unionbiometrics.com/img/email-signature/linkedin.png",
    fb: "https://www.facebook.com/unionbiometrics/",
    yt: "https://www.youtube.com/@unionbiometrics",
    ln: "https://www.linkedin.com/company/unionbiometrics",
    iconBase: "auto",
    lockCompanyFields: true
  };

  function loadConfig(){
    return fetch("config.json", {cache:"no-store"})
      .then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(json){ return Object.assign({}, DEFAULT_CONFIG, json); })
      .catch(function(){ return Object.assign({}, DEFAULT_CONFIG); });
  }

  global.SigCore = {
    buildSignature: buildSignature,
    loadConfig: loadConfig,
    DEFAULT_CONFIG: DEFAULT_CONFIG,
    esc: esc
  };
})(window);
