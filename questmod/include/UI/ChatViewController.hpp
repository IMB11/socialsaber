#pragma once

#include "main.hpp"
#include "HMUI/ViewController.hpp"

#define DECLARE_OVERRIDE_METHOD_MATCH(retval, name, mptr, ...)      \
DECLARE_OVERRIDE_METHOD(                                          \
retval, name,                                                 \
il2cpp_utils::il2cpp_type_check::MetadataGetter<mptr>::get(), \
__VA_ARGS__)

DECLARE_CLASS_CODEGEN(SocialSaber::UI, ChatViewController, HMUI::ViewController,
                      DECLARE_DEFAULT_CTOR();
                      DECLARE_OVERRIDE_METHOD_MATCH(
                          void, DidActivate, &HMUI::ViewController::DidActivate,
                          bool firstActivation, bool addedToHierarchy,
                          bool screenSystemEnabling);)