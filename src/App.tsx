import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Typography,
    Grid,
    Divider,
    Card,
    CardContent,
    CardActions,
    Stack,
    CircularProgress
} from '@mui/material';
import { invoke } from '@tauri-apps/api/core';
// const invoke = window.__TAURI__.core.invoke;
interface Product {
    id: number;
    title: string;
    exePath: string
    description: string;
    imageUrl: string;
}
interface HardwareInfo {
    osInfo: any;
    baseBoardInfo: any;
    BIOSInfo: any;
    CPUInfo: any;
    memoryInfo: any;
    GPUInfo: any;
    audioInfo: any;
    networkAdapterInfo: any;
    diskInfo: any;
    monitorInfo: any;
    OEMInfo: any;
    batteryInfo: any;
}
type ContentMap = {
    [key: string]: Product[];
};

// 模拟不同选项对应的内容
const contentMap: ContentMap = {
    '硬件信息': [
        {
            id: 0,
            title: "",
            description: "",
            exePath: "",
            imageUrl: ""
        }
    ],
    'CPU工具': [
        {
            id: 3,
            title: 'CPU-Z (64位)',
            description: '当前最流行的CPU检测工具，附带基准测试功能',
            exePath: "./tools/处理器工具/CPUZ/cpuz_x64.exe",
            imageUrl: 'https://via.placeholder.com/150?text=Image+C',
        },
        {
            id: 3,
            title: 'CPU-Z (32位)',
            description: '当前最流行的CPU检测工具，附带基准测试功能',
            exePath: "./tools/处理器工具/CPUZ/cpuz_x32.exe",
            imageUrl: 'https://via.placeholder.com/150?text=Image+C',
        }
    ],
    '主板工具': [],
    '内存工具': [
        {
            id: 5,
            title: 'MemTest',
            description: '一款可以在windows系统下测试内存稳定性的软件',
            exePath: "./tools/内存工具/memtest/memtest.exe",
            imageUrl: 'https://via.placeholder.com/150?text=Image+E',
        },
    ],
    '显卡工具': [],
    '磁盘工具': [],
    '屏幕工具': [],
    '综合工具': [],
    '外设工具': [],
    '烤鸡工具': [],
    '游戏工具': [],
    '其他工具': [],
};

const getHardwareInfo = async (hardware_type: string): Promise<any> => {
    try {
        // 等待 invoke 完成并获取结果
        const message = await invoke("get_hardware_info", { className: hardware_type });

        // 统一处理消息类型
        const jsonString = typeof message === 'string'
            ? message
            : JSON.stringify(message);

        // 解析为JSON对象
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(hardware_type, "json解析失败:", error);
        // throw error; // 抛出错误以便调用者处理
        return null;
    }
}

const sidebarItems = Object.keys(contentMap);

export default function App() {
    const [selected, setSelected] = useState(sidebarItems[0]); // 默认选中第一个
    const [loading, setLoading] = useState(true);

    const handleSelect = (item: string) => {
        setSelected(item);
    };

    useEffect(() => {
        setLoading(false);

    }, []);

    const currentCards = contentMap[selected] || [];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row', // 确保子元素水平排列
            width: '100%',
            height: '100%',
        }}>
            <Box sx={{
                display: 'flex',
                width: '20%',
                height: '100%',
            }}>
                <ButtonGroup variant="text" aria-label="Basic button group" orientation="vertical" size="large">
                    {sidebarItems.map(item => (
                        <Button
                            key={item}
                            onClick={() => {
                                handleSelect(item);
                                // getHardwareInfo("Win32_Keyboard");
                                // invoke("start_exe", { exePath:"./tools/处理器工具/CPUZ/cpuz_x32.exe"})
                            }}
                            variant={selected === item ? 'contained' : 'text'}
                        >
                            {item}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>
            <Box sx={{
                display: 'flex',
                width: '80%',
                height: '100%',
            }}>
                {currentCards.length > 0 ? (
                    <Box>
                        {currentCards.some(card => card.id === 0) ? (//硬件信息
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center', // 水平居中
                                alignItems: 'center',     // 垂直居中
                                width: "100vh",
                                height: '100vh',          // 容器高度（根据需要调整）
                            }}>
                                {/* {loading ? (
                                    <Box></Box>
                                ) : ( */}
                                    <Stack spacing={2}>
                                        <TextInfo friendlyName="操作系统" className="Win32_OperatingSystem" />
                                        <TextInfo friendlyName="主板" className="Win32_BaseBoard" />
                                        <TextInfo friendlyName="BIOS" className="Win32_BIOS" />
                                        <TextInfo friendlyName="CPU" className="Win32_Processor" />
                                        <TextInfo friendlyName="内存" className="Win32_MemoryDevice" />
                                        <TextInfo friendlyName="显卡" className="Win32_VideoController" />
                                        <TextInfo friendlyName="声卡" className="Win32_SoundDevice" />
                                        <TextInfo friendlyName="网卡" className="Win32_NetworkAdapter" />
                                        <TextInfo friendlyName="磁盘" className="Win32_DiskDrive" />
                                        <TextInfo friendlyName="显示器" className="monitor" />
                                        <TextInfo friendlyName="OEM" className="Win32_ComputerSystem" />
                                        <TextInfo friendlyName="电池" className="Win32_Battery" />
                                    </Stack>
                                {/* )} */}


                            </Box>
                        ) : (//工具
                            <Grid container spacing={2}>
                                {currentCards.map(item => (
                                    <Grid>
                                        <Button
                                            onClick={() => {
                                                invoke("start_exe", { exePath: item.exePath })
                                            }}
                                        >
                                            <Box sx={{
                                                display: 'flex',
                                                width: '100%',
                                                height: '100%',
                                            }}>

                                                {/* 左侧图片区域 (30%) */}
                                                <Box component="img" src={item.imageUrl}>
                                                </Box>

                                                {/* 右侧文本区域 (70%) */}
                                                <Box sx={{
                                                    width: '70%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    padding: '8px 12px',
                                                }}>

                                                    {/* 标题行 */}
                                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.1 }}>
                                                        {item.title || "应用程序标题"}
                                                    </Typography>

                                                    {/* 分隔线 */}
                                                    <Divider sx={{ width: '100%', my: 0.5 }} />

                                                    {/* 描述行1 */}
                                                    <Typography variant="body2" sx={{ mt: 0.5, color: '#555' }}>
                                                        {item.description || "第一行描述信息"}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                ) : (//空
                    <Box>
                        <Typography color="text.secondary">该选项下暂无内容</Typography>
                    </Box>
                )}
            </Box>

        </Box >


    );
}

function TextInfo(props: { friendlyName: string; className: string }) {
    const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHardwareInfo = async () => {
            setHardwareInfo(await getHardwareInfo(props.className));
            setLoading(false);
        }

        fetchHardwareInfo();

    }, []);

    useEffect(() => {
        console.log(props.friendlyName, hardwareInfo);
    }, [hardwareInfo]);

    return (
        <Card sx={{ width: "100vh" }}>
            <CardContent>
                <Typography variant="h5">
                    {props.friendlyName}
                </Typography>
                <Divider sx={{ width: '100%', my: 0.5 }} />
                {loading ? (
                    <CircularProgress enableTrackSlot size={40} />
                ) : (
                    <Typography>
                        {JSON.stringify(hardwareInfo, null, 2)}
                    </Typography>
                )}

            </CardContent>
        </Card>
    );
}
