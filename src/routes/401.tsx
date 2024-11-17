import React from 'react'

export default function Unauthorized() {
  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif;'
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="flex w-[512px] max-w-[960px] flex-1 flex-col py-5">
            <div className="@container">
              <div className="@[480px]:px-4 @[480px]:py-3">
                <div
                  className="@[480px]:rounded-xl flex min-h-[400px] w-full flex-col justify-end overflow-hidden bg-[#FFFFFF] bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1624513380394-62c7d9104e97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Uml2ZXJzbGVpZ2glMjAlRUQlOTklOTQlRUMlODQlOUR8ZW58MHx8MHx8fDA%3D")'
                  }}
                ></div>
              </div>
            </div>
            <h1 className="px-4 pb-3 pt-5 text-center text-[22px] font-bold leading-tight tracking-[-0.015em] text-black">
              동경 게시판에 오신것을 환영합니다.
            </h1>
            <p className="px-4 pb-3 pt-1 text-center text-base font-normal leading-normal text-black">
              동경 게시판은 동경(동훈, 경민)이 만든 자유롭게 소통하는
              게시판입니다.
              <br />
              게시판을 보려면 회원가입을 해주세요.
            </p>
            <div className="flex items-center justify-center">
              <div className="flex flex-1 flex-wrap justify-center gap-3 px-4 py-3">
                <button className="flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#EEEEEE] px-5 text-base font-bold leading-normal tracking-[0.015em] text-black">
                  <span className="truncate">로그인</span>
                </button>
                <button className="flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-black px-5 text-base font-bold leading-normal tracking-[0.015em] text-[#FFFFFF]">
                  <span className="truncate">회원가입</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
