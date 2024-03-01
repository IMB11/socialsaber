#include "UI/ChatViewController.hpp"

#include <Networking/WebsocketHelper.hpp>

#include "questui/shared/BeatSaberUI.hpp"
#include "json.hpp"

DEFINE_TYPE(SocialSaber::UI, ChatViewController)

using namespace SocialSaber::UI;
using namespace UnityEngine;
using namespace QuestUI;
using jsonn = nlohmann::json;

void ChatViewController::DidActivate(bool firstActivation, bool b, bool c) {
	if(firstActivation) {
		auto login__group = BeatSaberUI::CreateModifierContainer(get_transform());

		auto txt = BeatSaberUI::CreateText(login__group, "<size=12>Log In</size>");
		txt->set_alignment(TMPro::TextAlignmentOptions::Center);
		std::optional<std::string> username;
		std::optional<std::string> password;
		BeatSaberUI::CreateStringSetting(login__group->get_transform(), "Username", "", [&username](std::string newVal) {
			username = std::optional{newVal};
		});
		BeatSaberUI::CreateStringSetting(login__group->get_transform(), "Password", "", [&password](std::string newVal) {
			password = std::optional{newVal};
		});
		BeatSaberUI::CreateUIButton(login__group->get_transform(), "Login", [username, password] {
			if(Networking::isRunning) {
				jsonn obj = {
					{"id", "authentication-raw-request"},
					{"username", username.value()},
					{"password", password.value()}
				};
				Networking::instance.send(obj);
			}
		});
	}
}