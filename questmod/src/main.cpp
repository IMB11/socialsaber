#include "main.hpp"

#include "Networking/WebsocketHelper.hpp"
#include "GlobalNamespace/MainFlowCoordinator.hpp"
#include "UI/ChatViewController.hpp"

using namespace GlobalNamespace;
using namespace UnityEngine;

static ModInfo modInfo;

// Called at the early stages of game loading
extern "C" void setup(ModInfo& info) {
	info.id = MOD_ID;
	info.version = VERSION;
	modInfo = info;
}

MAKE_HOOK_MATCH(MainFlowCoordinatorSetup, &MainFlowCoordinator::DidActivate, void, MainFlowCoordinator* self, bool firstActivation, bool addedToHierarchy, bool screenSystemEnabling) {
	if(firstActivation) {
		self->providedBottomScreenViewController = SocialSaber::UI::ChatViewController::New_ctor();
	}

	MainFlowCoordinatorSetup(self, firstActivation, addedToHierarchy, screenSystemEnabling);
}

// Called later on in the game loading - a good time to install function hooks
extern "C" void load() {
	il2cpp_functions::Init();

	SocialSaber::Networking::WebsocketManager ws = SocialSaber::Networking::WebsocketManager();

	INSTALL_HOOK(getLogger(), MainFlowCoordinatorSetup);
}

// Useless... paper is better.
Logger &getLogger() {
	static Logger *logger = new Logger(modInfo);
	return *logger;
}