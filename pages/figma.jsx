import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FigmaIcon } from '../components/icons'
import moment from 'moment'

const Spiner = (props) => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <span>
                <svg role="status" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </span>
        </div>
    )
}

export default function Home() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState('')
    const [state, setState] = useState('')
    const [teamId, setTeamId] = useState()
    const [files, setFiles] = useState([])

    const handleSyncData = async (e) => {
        try {
            setLoading(true)
            e.preventDefault()
    
            console.log('[handleSyncData]', code, state, teamId)
            if (!code) return false;
    
            const functionUrl = "https://2dx3kvwlgcnipn3bamerkdv4by0vcdna.lambda-url.us-east-1.on.aws/"
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            const raw = JSON.stringify({
              "code": code,
              "team_id": teamId,
              "redirect_uri": process.env.NEXT_PUBLIC_FIGMA_REDIRECT_URI
            });
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
            };
            
            const res = await fetch(functionUrl, requestOptions)
            const data = await res.json()
            setFiles(data)
            console.log('[data]', data)
            setLoading(false)
        }
        catch (err) {
            console.log('[err]', err)
            setLoading(false)
        }
    }

    const openFile = (key) => {
        window. open("https://www.figma.com/file/" + key, "_blank");
    }

    useEffect(() => {
        setCode(router.query.code)
        setState(router.query.state)
    }, [router])

    if(loading) return <Spiner />
    
    return (
        <div className={`container mx-auto`}>
            <Head>
                <title>Fabric | Figma Connection</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main className={`px-8 flex-col items-center justify-center pt-0 pb-8`}>
                <div className='w-full py-10'>
                    <div className='py-4 flex items-center justify-center'>
                        <Link href="/">
                            <a>
                                <Image src={'https://s3-alpha.figma.com/oauth_img/8f475943-6489-4e91-87a4-d7453dc09f36'} width={100} height={100}  />
                            </a>
                        </Link>
                    </div>
                    <div className="flex items-center justify-center">
                        <span>
                            <FigmaIcon width={'24px'} />
                        </span>
                        <span className="text-2xl font-semibold ml-3">Figma Connected</span>
                    </div>
                    {
                        (typeof files === 'object' || typeof files === 'array') && files?.length ? (
                            <div className='mx-auto w-full max-w-screen-xl pt-16'>
                                <div className="flex items-center justify-center flex-wrap">
                                {
                                    files.sort(function(a, b){return new Date(b.last_modified) - new Date(a.last_modified)}).map(file => (
                                        <div
                                            className='mx-2 mb-4 rounded-lg border border-gray-300 w-72 shrink-0 focus:ring-2 focus:ring-blue-500 overflow-hidden hover:shadow-md select-none'
                                            tabIndex={0}
                                            key={file.key}
                                            onDoubleClick={() => openFile(file.key)}
                                        >
                                            <div className='bg-gray-200 p-3'>
                                                <Image src={file.thumbnail_url} width="286" height="180" />
                                            </div>
                                            <div className='flex items-center p-3'>
                                                <span className='block mr-2'>
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 24H19C19.552 24 20 23.552 20 23V5.914C20 5.649 19.895 5.394 19.707 5.207L14.793 0.293C14.605 0.105 14.35 0 14.086 0H1C0.448 0 0 0.448 0 1V23C0 23.552 0.448 24 1 24Z" fill="#18A0FB"/>
                                                        <path d="M14.5 4.5V0L16.207 1.707L18.293 3.793L20 5.5H15.5C14.948 5.5 14.5 5.052 14.5 4.5Z" fill="#9BD5FD"/>
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.858 9.995L10.847 9.992L6.444 8.737L9.701 11.994C9.817 11.954 9.941 11.932 10.071 11.932C10.699 11.932 11.209 12.442 11.209 13.071C11.209 13.699 10.699 14.209 10.071 14.209C9.442 14.209 8.932 13.699 8.932 13.071C8.932 12.941 8.954 12.817 8.994 12.701L5.742 9.45L6.944 13.642L6.954 13.678L6.962 13.716C7.26 15.159 8.54 16.244 10.071 16.244C10.42 16.244 10.754 16.188 11.066 16.085L11.651 15.892L12.086 16.328L13.317 17.558L14.586 16.29L13.341 15.046L12.911 14.615L13.095 14.035C13.192 13.732 13.245 13.408 13.245 13.071C13.245 11.595 12.236 10.352 10.87 9.998L10.858 9.995ZM15.293 15.583L16 16.29L15.293 16.997L14.024 18.266L13.317 18.973L12.61 18.266L11.38 17.035C10.968 17.171 10.528 17.245 10.07 17.245C8.056 17.245 6.374 15.817 5.983 13.917L4.325 8.132L4 7L5.133 7.323L11.121 9.03C12.918 9.496 14.244 11.128 14.244 13.07C14.244 13.513 14.176 13.939 14.048 14.338L15.293 15.583Z" fill="white"/>
                                                    </svg>
                                                </span>
                                                <div className='flex-col'>
                                                    <span className='block text-sm font-medium'>{file.name}</span>
                                                    <span className='block text-xs text-gray-500'>Edited {moment.duration(moment().diff(file.last_modified)).humanize()} ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                            </div>
                        ) : 
                        (
                            <div>
                                <div className='w-72 mx-auto'>
                                    <form action="" onSubmit={(e) => handleSyncData(e)}>
                                        <div className='pt-16'>
                                            <label htmlFor="team_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Team ID</label>
                                            <input
                                                type="text"
                                                id="team_id"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none block w-full p-2.5"
                                                placeholder="Enter your Team ID"
                                                onChange={e => setTeamId(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="py-4 text-center">
                                            <button
                                                className='text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2'
                                            >
                                                Sync data
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Image src="/images/team_id.png" alt="Team ID Screenshot" width={500} height={347} />
                                </div>
                            </div>
                        )
                    }
                </div>
            </main>

            <footer className={`flex flex-1 p-4 bg-white border-t border-t-gray-200 items-center justify-center fixed bottom-0 left-0 w-full`}>
                <p>&copy; 2022 All rights reserved</p>
            </footer>
        </div>
    )
}
