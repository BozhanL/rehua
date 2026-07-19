(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[127],{15968:(e,t,n)=>{"use strict";n.d(t,{A:()=>s});var r=n(73365),i=n(85971);let s=function({text1:e,text2:t,iconProps:n,iconPosition:s="center",textAlign:o="center",textIconGap:l,height:a=40,foregroundColor:h="text-rehua-white",backgroundColor:d="bg-rehua-black",horizontalPadding:c,verticalPadding:u,lineHeight:x=1,style:g,onClick:f,...b}){let p=Math.round(.35*a),w=Math.round(a*(n?.width??.7)),j=Math.round(.45*a),m=c?Math.round(a*c):Math.round(.3*a),k=u?Math.round(a*u):null,v=l?Math.round(a*l):Math.round(.2*a);return(0,r.jsxs)("button",{...b,style:{minHeight:a,borderRadius:p,fontSize:j,paddingInline:m,paddingBlock:k??void 0,gap:v,boxShadow:"inset 0 4px 10px rgb(0 0 0 / 0.3)",...g},className:`
        inline-flex w-fit cursor-pointer items-center justify-center
        ${"right"===s?"flex-row-reverse":"flex-row"}
        ${d}
        transition-all duration-100
        active:brightness-80
      `,onClick:f,children:[n&&(0,r.jsx)(i.A,{...n,width:w,className:h}),void 0!==e&&(0,r.jsxs)("span",{className:`
            inline-flex flex-col
            ${{left:"text-left",right:"text-right",center:"text-center"}[o]}
            ${h}
            font-semibold
          `,style:{lineHeight:x},children:[(0,r.jsx)("span",{children:e}),void 0!==t&&(0,r.jsx)("span",{children:t})]})]})}},71622:(e,t,n)=>{Promise.resolve().then(n.bind(n,92236))},92236:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>o});var r=n(73365),i=n(15968),s=n(1521);function o({error:e,unstable_retry:t}){return(0,s.useEffect)(()=>{console.error(e)},[e]),(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{children:"Something went wrong!"}),(0,r.jsx)("p",{children:e.message}),(0,r.jsx)(i.A,{type:"button",text1:"Try again",iconProps:{name:"alert"},foregroundColor:"text-rehua-white",backgroundColor:"bg-rehua-green",textAlign:"right",onClick:t})]})}}},e=>{e.O(0,[971,347,494,358],()=>e(e.s=71622)),_N_E=e.O()}]);