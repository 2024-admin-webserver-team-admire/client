import Header from 'components/Header'
import Unauthorized from './Unauthorized'
import useAuth from 'hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Root() {
  const { isAuthorized } = useAuth()
  const navigate = useNavigate()
  const onPressGoToBoard = () => {
    navigate('/posts')
  }

  if (!isAuthorized) {
    return <Unauthorized />
  }

  return (
    <>
      <Header />
      <div
        className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-[#FFFFFF]"
        style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
      >
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center px-40 py-5">
            <div className="flex max-w-[960px] flex-1 flex-col">
              <div className="flex flex-col px-4 py-6">
                <div className="flex flex-col items-center gap-6">
                  <div
                    className="aspect-video w-full max-w-[360px] rounded-xl bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://cdn.usegalileo.ai/sdxl10/949ebf79-85b2-4258-b19b-bd1383ad6ec5.png")'
                    }}
                  ></div>
                  <div className="flex max-w-[480px] flex-col items-center gap-2">
                    <p className="max-w-[480px] text-center text-lg font-bold leading-tight tracking-[-0.015em] text-black">
                      동경 게시판에 오신것을 환영합니다
                    </p>
                    <p className="max-w-[480px] text-center text-sm font-normal leading-normal text-black">
                      화석들로 이루어져 있고, 어쩌구 저쩌구 나중에 추가될 내용
                    </p>
                  </div>
                  <button
                    className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#EEEEEE] px-4 text-sm font-bold leading-normal tracking-[0.015em] text-black"
                    onClick={onPressGoToBoard}
                  >
                    <span className="truncate">게시판 둘러보기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
