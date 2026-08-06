(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[127],{15968:(e,t,n)=>{"use strict";n.d(t,{A:()=>s});var r=n(73365),i=n(40920);let s=function({text1:e,text2:t,iconProps:n,iconPosition:s="center",textAlign:o="center",textIconGap:l,height:a=40,foregroundColor:h="text-rehua-white",backgroundColor:d="bg-rehua-black",horizontalPadding:c,verticalPadding:u,lineHeight:x=1,style:g,className:f,onClick:b,...p}){let w=Math.round(.35*a),j=Math.round(a*(n?.width??.7)),m=Math.round(.45*a),k=c?Math.round(a*c):Math.round(.3*a),v=u?Math.round(a*u):null,M=l?Math.round(a*l):Math.round(.2*a);return(0,r.jsxs)("button",{...p,style:{minHeight:a,borderRadius:w,fontSize:m,paddingInline:k,paddingBlock:v??void 0,gap:M,boxShadow:"inset 0 4px 10px rgb(0 0 0 / 0.3)",...g},className:`
        inline-flex w-fit cursor-pointer items-center justify-center
        ${"right"===s?"flex-row-reverse":"flex-row"}
        ${d}
        transition-all duration-100
        active:brightness-80
      `,onClick:b,children:[n&&(0,r.jsx)(i.A,{...n,width:j,className:h}),void 0!==e&&(0,r.jsxs)("span",{className:`
            inline-flex flex-col
            ${{left:"text-left",right:"text-right",center:"text-center"}[o]}
            ${h}
            font-semibold
            ${String(f)||""}
          `,style:{lineHeight:x},children:[(0,r.jsx)("span",{children:e}),void 0!==t&&(0,r.jsx)("span",{children:t})]})]})}},71622:(e,t,n)=>{Promise.resolve().then(n.bind(n,92236))},92236:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>o});var r=n(73365),i=n(15968),s=n(1521);function o({error:e,unstable_retry:t}){return(0,s.useEffect)(()=>{console.error(e)},[e]),(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{children:"Something went wrong!"}),(0,r.jsx)("p",{children:e.message}),(0,r.jsx)(i.A,{type:"button",text1:"Try again",iconProps:{name:"alert"},foregroundColor:"text-rehua-white",backgroundColor:"bg-rehua-green",textAlign:"right",onClick:t})]})}}},e=>{e.O(0,[920,347,494,358],()=>e(e.s=71622)),_N_E=e.O()}]);