"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ColorScale from "../components/ColorScale";
import FeatureMap from "../components/FeatureMap";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import Waveform from "../components/Waveform";
import { Moon, Sun, Github, Brain, Zap, Eye, BarChart3, Waves, Cog, Shield, Palette, CheckCircle, Music, Cpu } from "lucide-react";

interface Prediction {
  class: string;
  confidence: number;
}

interface LayerData {
  shape: number[];
  values: number[][];
}

type VisualizationData = Record<string, LayerData>;

interface WaveformData {
  values: number[];
  sample_rate: number;
  duration: number;
}

interface ApiResponse {
  predictions: Prediction[];
  visualization: VisualizationData;
  input_spectrogram: LayerData;
  waveform: WaveformData;
}

const ESC50_EMOJI_MAP: Record<string, string> = {
  dog: "🐕",
  rain: "🌧️",
  crying_baby: "👶",
  door_wood_knock: "🚪",
  helicopter: "🚁",
  rooster: "🐓",
  sea_waves: "🌊",
  sneezing: "🤧",
  mouse_click: "🖱️",
  chainsaw: "🪚",
  pig: "🐷",
  crackling_fire: "🔥",
  clapping: "👏",
  keyboard_typing: "⌨️",
  siren: "🚨",
  cow: "🐄",
  crickets: "🦗",
  breathing: "💨",
  door_wood_creaks: "🚪",
  car_horn: "📯",
  frog: "🐸",
  chirping_birds: "🐦",
  coughing: "😷",
  can_opening: "🥫",
  engine: "🚗",
  cat: "🐱",
  water_drops: "💧",
  footsteps: "👣",
  washing_machine: "🧺",
  train: "🚂",
  hen: "🐔",
  wind: "💨",
  laughing: "😂",
  vacuum_cleaner: "🧹",
  church_bells: "🔔",
  insects: "🦟",
  pouring_water: "🚰",
  brushing_teeth: "🪥",
  clock_alarm: "⏰",
  airplane: "✈️",
  sheep: "🐑",
  toilet_flush: "🚽",
  snoring: "😴",
  clock_tick: "⏱️",
  fireworks: "🎆",
  crow: "🐦‍⬛",
  thunderstorm: "⛈️",
  drinking_sipping: "🥤",
  glass_breaking: "🔨",
  hand_saw: "🪚",
};

const getEmojiForClass = (className: string): string => {
  return ESC50_EMOJI_MAP[className] ?? "🔈";
};

const features = [
  { icon: Brain, title: "Deep Audio CNN", description: "Advanced neural network for precise sound classification" },
  { icon: Cpu, title: "ResNet Architecture", description: "Residual blocks for enhanced learning capabilities" },
  { icon: Music, title: "Mel Spectrogram", description: "Audio-to-image conversion for optimal processing" },
  { icon: Zap, title: "Data Augmentation", description: "Mixup & Time/Frequency masking for robust training" },
  { icon: Zap, title: "Serverless GPU", description: "Lightning-fast inference with Modal platform" },
  { icon: Eye, title: "Interactive Dashboard", description: "Modern Next.js & React visualization interface" },
  { icon: BarChart3, title: "Feature Visualization", description: "Internal CNN feature maps for deep insights" },
  { icon: Waves, title: "Real-time Analysis", description: "Instant audio classification with confidence scores" },
  { icon: Waves, title: "Waveform Display", description: "Beautiful spectrogram and waveform visualization" },
  { icon: Cog, title: "FastAPI Endpoint", description: "High-performance API for seamless integration" },
  { icon: Shield, title: "Optimized Training", description: "AdamW & OneCycleLR for efficient learning" },
  { icon: Palette, title: "Modern UI", description: "Tailwind CSS & Shadcn UI components" }
];

function splitLayers(visualization: VisualizationData) {
  const main: [string, LayerData][] = [];
  const internals: Record<string, [string, LayerData][]> = {};

  for (const [name, data] of Object.entries(visualization)) {
    if (!name.includes(".")) {
      main.push([name, data]);
    } else {
      const [parent] = name.split(".");
      if (parent === undefined) continue;

      internals[parent] ??= [];
      internals[parent].push([name, data]);
    }
  }

  return { main, internals };
}

export default function HomePage() {
  const [vizData, setVizData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'true');
    }
  }, []);

  // Apply dark mode class to document and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    setVizData(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const response = await fetch("https://chaudharygaurav2004--audio-cnn-inference-audioclassifier-3d645a.modal.run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio_data: base64String }),
        });

        if (!response.ok) {
          throw new Error(`API error ${response.statusText}`);
        }

        const data = await response.json() as ApiResponse;
        setVizData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occured",
        );
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed ot read the file.");
      setIsLoading(false);
    };
  };

  const { main, internals } = vizData
    ? splitLayers(vizData?.visualization)
    : { main: [], internals: {} };

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center py-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VT</span>
            </div>
            <span className="text-xl font-semibold text-stone-900 dark:text-stone-100">VoiceTell</span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.open('https://github.com/your-username/voicetell', '_blank')}
              variant="outline"
              size="sm"
              className="border-stone-300 dark:border-stone-600"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="sm"
              className="border-stone-300 dark:border-stone-600"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!vizData ? (
          <>
            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16 sm:py-24"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-6xl font-bold text-stone-900 dark:text-stone-100 mb-6"
              >
                Analyze Audio with
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> AI</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl text-stone-600 dark:text-stone-400 mb-12 max-w-3xl mx-auto"
              >
                Upload any audio file and let our advanced Deep Learning CNN identify and classify the sounds. 
                From animal sounds to environmental audio - discover what&apos;s in your recordings.
              </motion.p>

              {/* Upload Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col items-center space-y-6"
              >
                <div className="relative">
                  <input
                    type="file"
                    accept=".wav"
                    id="file-upload"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="absolute inset-0 w-full cursor-pointer opacity-0 z-10"
                  />
                  <Button
                    disabled={isLoading}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Music className="mr-3 h-5 w-5" />
                        Choose Audio File
                      </>
                    )}
                  </Button>
                </div>

                {fileName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {fileName}
                    </Badge>
                  </motion.div>
                )}

                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Supports WAV files • Built with Python, PyTorch & Next.js
                </p>
              </motion.div>
            </motion.div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="py-16"
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
                  Powerful Features
                </h2>
                <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
                  Built with cutting-edge technology and modern web standards for the best audio analysis experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-stone-600 dark:text-stone-400">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="py-12 border-t border-stone-200 dark:border-stone-700"
            >
              <div className="text-center">
                <p className="text-stone-600 dark:text-stone-400">
                  Made with ❤️ by <span className="font-semibold text-stone-900 dark:text-stone-100">Gaurav Chaudhary</span>
                </p>
              </div>
            </motion.footer>
          </>
        ) : (
          /* Results Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8"
          >
            {/* Back Button */}
            <div className="mb-8">
              <Button
                onClick={() => {
                  setVizData(null);
                  setFileName("");
                  setError(null);
                }}
                variant="outline"
                className="mb-6"
              >
                ← Analyze Another File
              </Button>
            </div>

            {error && (
              <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <CardContent>
                  <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-stone-900 dark:text-stone-100">
                    Top Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vizData.predictions.slice(0, 3).map((pred, i) => (
                      <div key={pred.class} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-md font-medium text-stone-700 dark:text-stone-300">
                            {getEmojiForClass(pred.class)}{" "}
                            <span>{pred.class.replaceAll("_", " ")}</span>
                          </div>
                          <Badge variant={i === 0 ? "default" : "secondary"}>
                            {(pred.confidence * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <Progress value={pred.confidence * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader className="text-stone-900 dark:text-stone-100">
                    <CardTitle className="text-stone-900 dark:text-stone-100">
                      Input Spectrogram
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FeatureMap
                      data={vizData.input_spectrogram.values}
                      title={`${vizData.input_spectrogram.shape.join(" x ")}`}
                      spectrogram
                    />
                    <div className="mt-5 flex justify-end">
                      <ColorScale width={200} height={16} min={-1} max={1} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-stone-900 dark:text-stone-100">
                      Audio Waveform
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Waveform
                      data={vizData.waveform.values}
                      title={`${vizData.waveform.duration.toFixed(2)}s * ${vizData.waveform.sample_rate}Hz`}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Feature maps */}
              <Card>
                <CardHeader>
                  <CardTitle className="dark:text-stone-100">Convolutional Layer Outputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-6">
                    {main.map(([mainName, mainData]) => (
                      <div key={mainName} className="space-y-4">
                        <div>
                          <h4 className="mb-2 font-medium text-stone-700 dark:text-stone-300">
                            {mainName}
                          </h4>
                          <FeatureMap
                            data={mainData.values}
                            title={`${mainData.shape.join(" x ")}`}
                          />
                        </div>

                        {internals[mainName] && (
                          <div className="h-80 overflow-y-auto rounded border border-stone-200 bg-stone-50 p-2 dark:border-stone-700 dark:bg-stone-800">
                            <div className="space-y-2">
                              {internals[mainName]
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([layerName, layerData]) => (
                                  <FeatureMap
                                    key={layerName}
                                    data={layerData.values}
                                    title={layerName.replace(`${mainName}.`, "")}
                                    internal={true}
                                  />
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex justify-end">
                    <ColorScale width={200} height={16} min={-1} max={1} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
