declare module '@react-navigation/native-stack' {
  export type NativeStackScreenProps<
    ParamList extends Record<string, object | undefined>,
    RouteName extends keyof ParamList = string
  > = {
    navigation: {
      navigate: (routeName: string) => void;
      goBack: () => void;
    };
    route: {
      key: string;
      name: string;
      params: ParamList[RouteName];
    };
  };
}

declare module '@react-navigation/native' {
  export function NavigationContainer(props: any): JSX.Element;
}

declare module '@react-navigation/stack' {
  export function createStackNavigator(): {
    Navigator: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
  };
}

declare module 'react-native-safe-area-context' {
  export function SafeAreaProvider(props: any): JSX.Element;
  export function SafeAreaView(props: any): JSX.Element;
}

declare module 'react-native-vector-icons/MaterialIcons' {
  export default function Icon(props: {
    name: string;
    size: number;
    color: string;
  }): JSX.Element;
}

declare module '@react-native-async-storage/async-storage' {
  export default {
    getItem: (key: string) => Promise<string | null>,
    setItem: (key: string, value: string) => Promise<void>,
    removeItem: (key: string) => Promise<void>,
    clear: () => Promise<void>,
  };
}