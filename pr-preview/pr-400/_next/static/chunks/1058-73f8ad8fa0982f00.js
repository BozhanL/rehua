"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1058],{22476:(e,t,n)=>{n.d(t,{A:()=>i});var r=n(73365),l=n(36005);let i=function({text1:e,text2:t,iconProps:n,iconPosition:i="center",textAlign:s="center",textIconGap:a,height:o=40,foregroundColor:d="text-rehua-white",backgroundColor:c="bg-rehua-black",horizontalPadding:u,verticalPadding:h,lineHeight:f=1,style:x,className:p,onClick:g,type:m,...y}){let w=Math.round(.35*o),b=Math.round(o*(n?.width??.7)),v=Math.round(.45*o),j=u?Math.round(o*u):Math.round(.3*o),k=h?Math.round(o*h):null,N=a?Math.round(o*a):Math.round(.2*o);return(0,r.jsxs)("button",{...y,type:m??"button",style:{minHeight:o,borderRadius:w,fontSize:v,paddingInline:j,paddingBlock:k??void 0,gap:N,boxShadow:"inset 0 4px 10px rgb(0 0 0 / 0.3)",...x},className:`
        inline-flex w-fit cursor-pointer items-center justify-center
        ${"right"===i?"flex-row-reverse":"flex-row"}
        ${c}
        transition-all duration-100
        active:brightness-80
      `,onClick:g,children:[n&&(0,r.jsx)(l.A,{...n,width:b,className:d}),void 0!==e&&(0,r.jsxs)("span",{className:`
            inline-flex flex-col
            ${{left:"text-left",right:"text-right",center:"text-center"}[s]}
            ${d}
            font-semibold
            ${String(p)||""}
          `,style:{lineHeight:f},children:[(0,r.jsx)("span",{children:e}),void 0!==t&&(0,r.jsx)("span",{children:t})]})]})}},31834:(e,t,n)=>{n.d(t,{A:()=>i});var r=n(73365),l=n(36005);let i=function({rows:e,insidePadding:t}){return(0,r.jsx)("ul",{className:"overflow-hidden",style:{maxWidth:"100%"},children:e.map((e,n)=>{let i=e.redRow?"text-rehua-ruby":"",s=e.internalRowSize??19;return(0,r.jsxs)("li",{className:`
              flex gap-x-2
              ${t??"px-4"}
              py-2
              ${e.stacked?"flex-col items-start gap-y-1":"items-center"}
              ${n%2==0?"bg-rehua-white":"bg-rehua-light-gray"}
            `,children:[(0,r.jsxs)("span",{className:`
                flex items-center gap-x-2 font-bold
                ${i}
              `,style:{fontSize:s},children:[e.iconProps&&(0,r.jsx)(l.A,{width:s,className:i,...e.iconProps}),e.heading,":"]}),(0,r.jsx)("div",{className:`
                min-w-0 flex-1
                ${e.stacked?"w-full":""}
                ${i}
                font-medium
              `,style:{fontSize:s,...e.contentStyle},children:e.content})]},e.heading)})})}},35537:(e,t,n)=>{n.d(t,{A:()=>a});var r=n(73365),l=n(22476),i=n(36005),s=n(96520);let a=function({isAlertPopup:e=!1,text1:t,text1Style:n,text1ClassName:a,text2:o,text2Style:d,text2ClassName:c,button1Props:u,button2Props:h,buttonsStyle:f,defaultButtonHeight:x=75,modalProps:p}){let[g,m,y]=e?["text-rehua-red","text-rehua-ruby","alert"]:["text-rehua-navy","text-rehua-navy","info-circle"],w={whiteSpace:"pre-line",fontSize:30,fontWeight:"bold",lineHeight:1.1,padding:8};return(0,r.jsx)(s.A,{...p,children:(0,r.jsxs)("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:20,minHeight:"100%"},children:[(0,r.jsx)(i.A,{name:y,className:m,width:170,style:{marginBottom:15}}),(0,r.jsx)("div",{style:{...w,...n},className:`
            ${g}
            ${a??""}
          `,children:t}),o&&(0,r.jsx)("div",{style:{...w,...d},className:`
              ${g}
              ${c??""}
            `,children:o}),(0,r.jsxs)("div",{style:{display:"flex",justifyContent:h?"space-between":"center",width:"80%",marginTop:35,...f},children:[(0,r.jsx)(l.A,{height:x,...u}),h&&(0,r.jsx)(l.A,{height:x,...h})]})]})})}},49082:(e,t,n)=>{n.d(t,{A:()=>l});var r=n(73365);let l=function({height:e=650,width:t=1100,opacity:n=.95,boxShadow:l="0 0 20px rgb(0 0 0 / 0.35)",children:i,style:s,...a}){let o="number"==typeof e&&"number"==typeof t?Math.round(.06*Math.min(e,t)):30;return(0,r.jsx)("div",{...a,style:{height:e,width:t,opacity:n,boxShadow:l,borderRadius:o,...s},className:"bg-rehua-white",children:i})}},49405:(e,t,n)=>{n.d(t,{A:()=>l});var r=n(73365);let l=function({style:e,...t}){return(0,r.jsx)("input",{...t,className:"bg-rehua-white",style:{width:"100%",fontSize:20,padding:"0 10px",border:"1px solid",borderRadius:6,boxShadow:"inset 0 1px 3px rgb(0 0 0 / 0.3)",outline:"none",...e}})}},62737:(e,t,n)=>{n.d(t,{A:()=>a});var r=n(73365),l=n(36005),i=n(1521),s=n(98196);let a=function({options:e,selectedValues:t,multiple:n=!1,defaultText:a="Select",labelMode:o="replace",search:d=!1,onChange:c,width:u=200,lengthOfDropdown:h,selectedColor:f="bg-rehua-blue",checkboxColor:x="accent-rehua-blue",textAlign:p="left",size:g=16,style:m,zindex:y}){let{isOpen:w,query:b,setQuery:v,activeIndex:j,listBoxRef:k,buttonRefs:N,wrapperRef:S,portalRef:$,handleKeyPress:A,handleOptionClick:z,toggleOpen:E,filteredOptions:R}=function({options:e,selectedValues:t,onChange:n,multiple:r=!1,search:l=!1}){let[s,a]=(0,i.useState)(!1),[o,d]=(0,i.useState)(""),[c,u]=(0,i.useState)(-1),h=(0,i.useRef)(null),f=(0,i.useRef)([]),x=(0,i.useRef)(null),p=(0,i.useRef)(null);function g(e){let l;r?l=t.includes(e)?t.filter(t=>t!==e):[...t,e]:(l=[e],a(!1)),n(l)}(0,i.useEffect)(()=>{s&&!l&&h.current?.focus()},[s,l]),(0,i.useEffect)(()=>{if(s)return document.addEventListener("pointerdown",e),()=>{document.removeEventListener("pointerdown",e)};function e(e){x.current&&p.current&&!x.current.contains(e.target)&&!p.current.contains(e.target)&&(a(!1),u(-1),d(""))}},[s]);let m=l?e.filter(e=>e.toLowerCase().includes(o.toLowerCase())):e;return{isOpen:s,query:o,setQuery:d,activeIndex:c,listBoxRef:h,buttonRefs:f,wrapperRef:x,portalRef:p,handleKeyPress:function(e){let t=m.length;if(0!==t)switch(e.key){case"ArrowUp":let n,r;e.preventDefault(),u(n=(c+t-1)%t),void 0!==(r=f.current[n])&&r?.scrollIntoView({block:"nearest"});break;case"ArrowDown":let l,i;e.preventDefault(),u(l=(c+1)%t),void 0!==(i=f.current[l])&&i?.scrollIntoView({block:"nearest"});break;case"Escape":e.preventDefault(),a(!1),u(-1);break;case"Enter":if(e.preventDefault(),void 0!==m[c]&&-1!==c){g(m[c]);break}return;default:return}},handleOptionClick:g,toggleOpen:function(){let e=!s;a(e),e||(u(-1),d(""))},filteredOptions:m}}({options:e,selectedValues:t,onChange:c,multiple:n,search:d}),[C,M]=(0,i.useState)({top:0,left:0});(0,i.useEffect)(()=>{if(w&&S.current)return e(),window.addEventListener("scroll",e,!0),window.addEventListener("resize",e),()=>{window.removeEventListener("scroll",e,!0),window.removeEventListener("resize",e)};function e(){let e=S.current?.getBoundingClientRect();e&&M({top:e.bottom,left:e.left})}},[w,S]);let I=Math.round(.6*g),L=Math.round(.8*g),D=Math.round(.25*g),B=a;return t.length&&(B="prefix"===o&&a?`${a} ${t.join(", ")}`:t.join(", ")),(0,r.jsxs)("div",{className:"relative inline-block",style:m,ref:S,children:[(0,r.jsxs)("button",{className:`
          flex items-center justify-between gap-2 rounded-sm border
          border-rehua-gray bg-rehua-white p-1
        `,style:{width:u,paddingBlock:D,paddingInline:D},type:"button",onClick:E,children:[(0,r.jsx)("span",{className:"block min-w-0 truncate",style:{fontSize:g},children:B}),(0,r.jsx)(l.A,{name:"dropdown-arrow",width:I,className:"mr-1 shrink-0"})]}),w&&(0,s.createPortal)((0,r.jsxs)("div",{tabIndex:0,ref:e=>{k.current=e,$.current=e},onKeyDown:e=>{A(e)},className:"\n              fixed overflow-x-hidden overflow-y-auto bg-rehua-white shadow-md\n              outline-none\n            ",style:{top:C.top,left:C.left,maxHeight:h,zIndex:y},children:[d&&(0,r.jsx)("input",{type:"text",value:b,onChange:e=>{v(e.target.value)},style:{width:u,fontSize:g},placeholder:"Search...",className:"w-full p-2 outline-none"}),0===R.length?(0,r.jsx)("div",{className:"px-2 text-rehua-dark-gray",style:{paddingBlock:D,fontSize:g},children:"No results"}):R.map((e,l)=>{let i=t.includes(e);return(0,r.jsxs)("button",{type:"button",className:`
                      flex w-full items-center gap-2 pl-2 outline-none
                      ${i&&!n?f:""}
                      ${(n||!i)&&j===l?"bg-rehua-light-gray":""}
              `,ref:e=>{N.current[l]=e},style:{width:u,textAlign:p},onClick:()=>{z(e)},children:[n&&(0,r.jsx)("input",{type:"checkbox",checked:i,readOnly:!0,tabIndex:-1,className:`
                          shrink-0
                          ${x}
                        `,style:{width:L,height:L,margin:0}}),(0,r.jsx)("span",{style:{fontSize:g},className:`
                        truncate
                        ${!n?"pl-2":""}
                      `,children:e})]},e)})]}),document.body)]})}},96520:(e,t,n)=>{n.d(t,{A:()=>a});var r=n(73365),l=n(49082),i=n(1521),s=n(98196);let a=function({open:e,showBackground:t=!0,backgroundOpacity:n=.1,surfaceProps:a,offsetX:o=0,offsetY:d=0,children:c,backgroundStyle:u}){return((0,i.useEffect)(()=>{if(!e)return;let t=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=t}},[e]),e)?(0,s.createPortal)((0,r.jsx)("div",{className:"fixed inset-0 z-50 flex items-center justify-center",style:{...u,backgroundColor:t?`rgb(0 0 0 / ${String(n)})`:"transparent"},children:(0,r.jsx)(l.A,{...a,style:{...a?.style,transform:`
            ${a?.style?.transform??""}
            translate(${String(o)}px, ${String(d)}px)
          `},children:c})}),document.body):(0,r.jsx)(r.Fragment,{})}}}]);