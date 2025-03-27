import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { TabNavigation } from "@/components/layout/TabNavigation";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ParliamentarySpeech } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Parliamentary() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    house: "all",
    language: "all",
    speakerId: "all",
  });
  const [selectedSpeech, setSelectedSpeech] = useState<ParliamentarySpeech | null>(null);
  const [translationLanguage, setTranslationLanguage] = useState("hindi");
  
  // Fetch parliamentary speeches
  const { data: speeches, isLoading } = useQuery<ParliamentarySpeech[]>({
    queryKey: ["/api/parliamentary-speeches"],
  });
  
  // Filter speeches
  const filteredSpeeches = speeches?.filter(speech => {
    let matches = true;
    
    if (filters.house && filters.house !== "all" && speech.house !== filters.house) {
      matches = false;
    }
    
    if (filters.language && filters.language !== "all" && speech.originalLanguage !== filters.language) {
      matches = false;
    }
    
    if (filters.speakerId && filters.speakerId !== "all" && speech.speakerId.toString() !== filters.speakerId) {
      matches = false;
    }
    
    return matches;
  });
  
  // Translation mutation
  const translateMutation = useMutation({
    mutationFn: async ({ speechId, targetLanguage }: { speechId: number; targetLanguage: string }) => {
      const res = await apiRequest("POST", `/api/parliamentary-speeches/${speechId}/translate`, { targetLanguage });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Translation complete",
        description: "Speech has been translated successfully",
      });
      
      // Update the speech with translation
      if (selectedSpeech) {
        const updatedTranslations = {
          ...(selectedSpeech.translations as any || {}),
          [translationLanguage]: data.translatedText
        };
        
        setSelectedSpeech({
          ...selectedSpeech,
          translations: updatedTranslations
        });
      }
    },
    onError: () => {
      toast({
        title: "Translation failed",
        description: "Failed to translate speech. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Get unique houses, languages, and speakers for filters
  const houses = speeches 
    ? Array.from(new Set(speeches.map(speech => speech.house)))
    : [];
  const languages = speeches
    ? Array.from(new Set(speeches.map(speech => speech.originalLanguage)))
    : [];
  const speakers = speeches?.reduce((acc, speech) => {
    if (!acc.some(s => s.id === speech.speakerId)) {
      acc.push({ id: speech.speakerId, name: `Speaker ${speech.speakerId}` }); // In real app, would fetch speaker names
    }
    return acc;
  }, [] as { id: number; name: string }[]) || [];
  
  // Function to handle speech selection
  const handleSpeechSelect = (speech: ParliamentarySpeech) => {
    setSelectedSpeech(speech);
  };
  
  // Function to handle translation
  const handleTranslate = () => {
    if (selectedSpeech) {
      translateMutation.mutate({
        speechId: selectedSpeech.id,
        targetLanguage: translationLanguage
      });
    }
  };
  
  // Format date
  const formatSpeechDate = (date: string | Date) => {
    return format(new Date(date), "PPP"); // Long date format
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MobileNav />
      <TabNavigation />
      
      <main className="flex-1 py-6 px-4 bg-gray-50">
        <div className="container mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-gray-800">
                Parliamentary Updates
              </CardTitle>
              <CardDescription>
                Access and translate speeches from Lok Sabha and Rajya Sabha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Select 
                    value={filters.house} 
                    onValueChange={(value) => setFilters({ ...filters, house: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by house" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Houses</SelectItem>
                      {houses.map(house => (
                        <SelectItem key={house} value={house}>
                          {house}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={filters.language} 
                    onValueChange={(value) => setFilters({ ...filters, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      {languages.map(language => (
                        <SelectItem key={language} value={language}>
                          {language.charAt(0).toUpperCase() + language.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    value={filters.speakerId} 
                    onValueChange={(value) => setFilters({ ...filters, speakerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by speaker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Speakers</SelectItem>
                      {speakers.map(speaker => (
                        <SelectItem key={speaker.id} value={speaker.id.toString()}>
                          {speaker.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Speech List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Speeches</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    // Loading skeletons
                    <div className="divide-y divide-gray-200">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="p-4">
                          <div className="flex items-start">
                            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                            <div className="ml-3 flex-1">
                              <Skeleton className="h-5 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-1" />
                              <Skeleton className="h-3 w-1/3" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredSpeeches && filteredSpeeches.length > 0 ? (
                    <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                      {filteredSpeeches.map(speech => (
                        <div 
                          key={speech.id} 
                          className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                            selectedSpeech?.id === speech.id ? 'bg-gray-50 border-l-4 border-primary' : ''
                          }`}
                          onClick={() => handleSpeechSelect(speech)}
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarFallback className="bg-primary text-white">
                                {speech.speakerId.toString().charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 flex-1">
                              <h3 className="font-medium text-gray-800">{speech.title}</h3>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span>{formatSpeechDate(speech.date)}</span>
                                <span className="mx-2">•</span>
                                <Badge variant="outline" className="capitalize">
                                  {speech.house}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Original: {speech.originalLanguage.charAt(0).toUpperCase() + speech.originalLanguage.slice(1)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>No speeches match your filter criteria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Speech Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {selectedSpeech ? selectedSpeech.title : "Speech Content"}
                    </CardTitle>
                    {selectedSpeech && (
                      <CardDescription>
                        {formatSpeechDate(selectedSpeech.date)} • {selectedSpeech.house}
                      </CardDescription>
                    )}
                  </div>
                  
                  {selectedSpeech && (
                    <div className="flex items-center space-x-2">
                      <Select 
                        value={translationLanguage} 
                        onValueChange={setTranslationLanguage}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="bengali">Bengali</SelectItem>
                          <SelectItem value="tamil">Tamil</SelectItem>
                          <SelectItem value="telugu">Telugu</SelectItem>
                          <SelectItem value="marathi">Marathi</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        onClick={handleTranslate}
                        disabled={translateMutation.isPending}
                      >
                        {translateMutation.isPending ? "Translating..." : "Translate"}
                      </Button>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  {selectedSpeech ? (
                    <Tabs defaultValue="original">
                      <TabsList className="mb-4">
                        <TabsTrigger value="original">Original</TabsTrigger>
                        <TabsTrigger 
                          value="translated"
                          disabled={!selectedSpeech.translations || 
                                  !(selectedSpeech.translations as any)?.[translationLanguage]}
                        >
                          Translated
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="original">
                        <div className="prose max-w-none">
                          <p className="text-sm text-gray-500 mb-2">
                            Original language: {selectedSpeech.originalLanguage.charAt(0).toUpperCase() + selectedSpeech.originalLanguage.slice(1)}
                          </p>
                          <div className="p-4 bg-gray-50 rounded-md">
                            {selectedSpeech.content}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="translated">
                        <div className="prose max-w-none">
                          <p className="text-sm text-gray-500 mb-2">
                            Translated to: {translationLanguage.charAt(0).toUpperCase() + translationLanguage.slice(1)}
                          </p>
                          <div className="p-4 bg-gray-50 rounded-md">
                            {(selectedSpeech.translations as any)?.[translationLanguage] || "No translation available"}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <p className="text-lg font-medium">Select a speech to view</p>
                      <p className="mt-2">
                        Choose a speech from the list to view its content and translations
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
