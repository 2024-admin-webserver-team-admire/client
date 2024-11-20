import Header from 'components/Header'
import { Link, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div
      className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="  flex h-full grow flex-col">
        <Header />
        <div className="flex flex-1 justify-center px-40 py-5">
          <div className="  flex max-w-[960px] flex-1 flex-col">
            <div className="flex flex-col px-4 py-6">
              <div className="flex flex-col items-center gap-6">
                <div
                  className="aspect-video w-full max-w-[360px] rounded-xl bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage:
                      'url("https://cdn.usegalileo.ai/sdxl10/8fd74f29-27bc-4c94-a259-34e60f0e5f18.png")'
                  }}
                ></div>
                <div className="flex max-w-[480px] flex-col items-center gap-2">
                  <p className="max-w-[480px] text-center text-lg font-bold leading-tight tracking-[-0.015em] text-black">
                    잘못된 페이지입니다.
                  </p>
                  <p className="max-w-[480px] text-center text-sm font-normal leading-normal text-black">
                    권한이 없거나 삭제된 페이지입니다.
                  </p>
                </div>
                <Link to={`/`}>
                  <button className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#EEEEEE] px-4 text-sm font-bold leading-normal tracking-[0.015em] text-black">
                    <span className="truncate">홈으로 돌아가기</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
