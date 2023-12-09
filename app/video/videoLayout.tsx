
import SettingsButton from '../music button/settings';
import Video from './video';

export default function VideoLayout() {
    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <SettingsButton />
            <Video />
        </div>
    );
}