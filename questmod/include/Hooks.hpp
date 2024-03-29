#pragma once

#include <vector>

#include "beatsaber-hook/shared/config/config-utils.hpp"
#include "beatsaber-hook/shared/utils/hooking.hpp"
#include "beatsaber-hook/shared/utils/il2cpp-functions.hpp"
#include "beatsaber-hook/shared/utils/logging.hpp"

namespace SocialSaber {
class Hooks {
private:
	inline static std::vector<void (*)(Logger &logger)> installFuncs;

public:
	static void AddInstallFunc(void (*installFunc)(Logger &logger)) {
		installFuncs.push_back(installFunc);
	}

	static void InstallHooks(Logger &logger) {
		for (auto installFunc : installFuncs) {
			installFunc(logger);
		}
	}
};
}

#define SocialSaberInstallHooks(func)                                        \
struct __SocialSaberRegister##func {                                       \
__SocialSaberRegister##func() { SocialSaber::Hooks::AddInstallFunc(func); } \
};                                                                      \
static __SocialSaberRegister##func __SocialSaberRegisterInstance##func;