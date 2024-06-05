

const AtividadeScreen = ({ route, navigation }) => {
    // let timer = TestApp();
    const [start, setStart] = useState(true);
    const [finish, setFinish] = useState(false);
    const [arvore, setArvore] = useState(0);
    const nArvores = 3;
  
    return (
      <View>
        <Text>
          corrida
        </Text>
        <StopWatch start={start} />
        {!finish ?
          <Pressable
            style={styles.button}
            onPress={() =>
              setStart(!start)
            }>
            <Text style={styles.text}>
              {start ? 'Pausar' : 'Retomar'}
            </Text>
          </Pressable> :
          <Pressable
            style={styles.button}
            onPress={() =>
              navigation.navigate('Final', {'tempo': '20m30s', 'distancia': '2km'})
            }>
            <Text style={styles.text}>
              Finalizar
            </Text>
          </Pressable>}
        {!finish ?
          <Pressable
            style={styles.button}
            onPress={() => {
              navigation.push('Escanear');
              setArvore(arvore + 1);
              if (arvore >= nArvores) {
                setStart(false);
                setFinish(true);
              }
            }
            }>
            <Text style={styles.text}>
              Camera
            </Text>
          </Pressable> :
          <View></View>}
        <Progress.Bar progress={arvore / nArvores} width={200} />
      </View>
    )
  }