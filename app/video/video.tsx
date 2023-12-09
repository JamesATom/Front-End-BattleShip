
export default function Video() {
    return (
        <video 
            className='absolute w-auto min-w-full min-h-full max-w-none' 
            style={{ 
                height: '100%', 
                width: '100%', 
                objectFit: 'fill', 
                position: 'absolute', 
                top: '0', 
                left: '0' 
            }} 
            autoPlay 
            loop 
            muted>
                <source src="mp4/bg3-1.mp4" type="video/mp4"/>
        </video>
    )
}