import { useQuery } from "@tanstack/react-query";
import { getAllNowShowingMovies } from "../api/moviesApi";
import { getAllSessions, getHalls } from "../api/sessionsApi";

const useNowShowingMovies = () => {
    return useQuery({
    queryKey: ["movies-now-showing"],
    queryFn: getAllNowShowingMovies,
    staleTime: 1000 * 60 // 1 minute
})}

const useSessions = () => 
{
    return useQuery({
    queryKey: ["sessions"],
    queryFn: () => getAllSessions(false,null),
    staleTime: 1000 * 60 // 1 minute
})}

const useFutureSessions = () =>
{
    return useQuery({
    queryKey: ["future-sessions"],
    queryFn: () => getAllSessions(true,null),
    staleTime: 1000 * 60 // 1 minute
})}

const useHalls = () =>
  {
    return useQuery({
    queryKey: ["future-sessions"],
    queryFn: () => getHalls,
    staleTime: 1000 * 60 // 1 minute
  })}  


export {useNowShowingMovies, useSessions, useFutureSessions, useHalls};
