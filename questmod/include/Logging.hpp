#pragma once

#include "paper/shared/logger.hpp"

#define LOG(...) INFO(__VA_ARGS__);
#define INFO(...) Paper::Logger::fmtLog<Paper::LogLevel::INF>(__VA_ARGS__);
#define ERROR(...) Paper::Logger::fmtLog<Paper::LogLevel::ERR>(__VA_ARGS__);
#define CRITICAL(...) Paper::Logger::fmtLog<Paper::LogLevel::ERR>(__VA_ARGS__);
#define DEBUG(...) Paper::Logger::fmtLog<Paper::LogLevel::DBG>(__VA_ARGS__);